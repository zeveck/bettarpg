#!/usr/bin/env python3
"""Battle simulator for GAME_DESIGN.md (design-time check; the build's
tools/sim-battles.mjs must reproduce these rules from battle.js/config.js).

Run: python3 tools/sim_design.py (exits 1 if a target is missed).
Based on the round-2 builder's sim.py, adjusted to the revised design.

Rules (also stated in the design, "Simulator rules"):
- Bubble is present in every fight after `bubbleJoined` (marked B). Rows
  without B are the pre-Bubble Shallows fights only.
- Start: full HP. MP as listed per row (full = rested; half = mid-outing).
- Player policy, each turn, first that applies:
    1. Heal: if carrying an HP item and (HP <= 35% max, or a warned
       GARGANTUAN GAR would bring HP to 0 or below): eat Seed Cake, else Kelp.
    2. Party mode (Gar friendship): Party! if MP >= 5; else drink an MP item;
       else Attack.
    3. Befriend mode: Party! (5 MP) once enemy HP <= 50% (or <= the chosen
       move's max + Bubble's max nip, so it isn't killed by accident);
       otherwise fight as below, but never spend the last 5 MP on a spell
       (Attack instead). Out of MP: Attack.
    4. Gravel Grenade if L >= 4, MP >= 5 and (Catfish, shelled Crayfish, or
       enemy HP > 12); else Bubble Blast if MP >= 3; else Attack.
- Armor: Helmet L3 -1, Advanced L5 -2, Full Metal L7 -3. The sub REPLACES
  armor with -4 (not stacked); GARGANTUAN GAR does 0 to the sub.
- Every hit that connects does at least 1 after armor (the special too, unless
  in the sub). Player hits: Crayfish shell -2, minimum 1.
- Rounding: enemy HP = Math.round (half up) of base x (1 + 0.55 x level);
  growth and Bubble bonuses floor; edge multiplier floors.
- Bubble: acts after you; nip 2-5 + floor(L/2); once per battle under 30% HP
  heals floor(15% max HP) instead. 20% of ALL enemy attacks (the Gar's special
  included) go at Bubble instead: no damage, Bubble is dizzy and skips its
  next action; a special drawn by Bubble pops no balloon.
- Gar: roars on its turns 1, 4, 7; GARGANTUAN GAR on 3, 6, 9, 12...; else bite.
- Gar friendship: the first Party! of the fight is free (friends burst in).
- Befriend success: the party cheers you up: +5 MP back and +15% max HP.
"""
import math, random, sys, zlib

def jsround(x): return math.floor(x + 0.5)

# kind: base HP, dmg lo, dmg hi, growth
E = {'guppy': (8, 2, 3, 0.8), 'angel': (12, 2, 3, 1.0), 'cat': (15, 2, 4, 1.2),
     'nymph': (14, 3, 4, 1.2), 'cich': (18, 3, 5, 1.5), 'cray': (20, 3, 5, 1.4)}

GAR_HP, GAR_BITE, GAR_SPECIAL = 230, (8, 12), 30
EDGE_MULT = 1.25
SEED, KELP, BWATER = 30, 10, 8

def armor(L): return 3 if L >= 7 else 2 if L >= 5 else 1 if L >= 3 else 0

GAP_FACTOR, GAP_FLOOR = 0.6, 0.2

def hbt_chance(L, ehp, ehp0, friends, edge=False, el=None):
    frac = 1 - ehp / ehp0
    if L >= 7: c = min(0.95, 0.35 + 0.50 * frac + 0.05 * friends)
    else:      c = min(0.80, 0.25 + 0.40 * frac + 0.03 * friends)
    # fish above your level: x0.6 per level, never below x0.2 (edge fish are Level 10)
    gap = (10 if edge else (el or L)) - L
    if gap > 0: c *= max(GAP_FLOOR, GAP_FACTOR ** gap)
    return c / 2 if edge else c

def fight(kind, el, L, bubble=True, kelp=0, seed=0, bw=0, edge=False, mp_frac=1.0,
          sub=False, friends=0, party=False, befriend=False, stump=False):
    hpmax = 20 + 6 * (L - 1); hp = hpmax
    mpmax = 10 + 2 * (L - 1); mp = math.floor(mpmax * mp_frac)
    b = math.floor(1.5 * (L - 1))
    ar = 4 if sub else armor(L)
    if kind == 'gar':
        ehp = GAR_HP; d0, d1 = GAR_BITE
    else:
        bh, d0, d1, g = E[kind]
        ehp = jsround(bh * (1 + 0.55 * el)); d0 += math.floor(g * (el - 1)); d1 += math.floor(g * (el - 1))
        if edge: ehp = math.floor(ehp * EDGE_MULT); d0 = math.floor(d0 * EDGE_MULT); d1 = math.floor(d1 * EDGE_MULT)
    ehp0 = ehp; shell = (kind == 'cray'); healed = False; dizzy = False; meter = 0
    gturn = 0; turn = 0; mp_used = 0; stump_cast = False
    per_cast = 2 if friends >= 10 else 1

    def hit(dmg): return max(1, dmg - ar)

    def enemy_act():
        nonlocal hp, dizzy, meter, gturn
        if kind == 'gar':
            gturn += 1; t = gturn
            if t in (1, 4, 7): return
            if t % 3 == 0:
                if bubble and random.random() < 0.2: dizzy = True; return
                if sub: return
                hp -= hit(GAR_SPECIAL)
                if party: meter = max(0, meter - 1)
                return
            if random.random() > 0.9: return
            if bubble and random.random() < 0.2: dizzy = True; return
            hp -= hit(random.randint(d0, d1)); return
        if random.random() > 0.9: return
        if bubble and random.random() < 0.2: dizzy = True; return
        lo, hi = d0, d1
        if kind == 'angel' and ehp < ehp0 / 2: lo += 2; hi += 2
        hp -= hit(random.randint(lo, hi))

    def dmg_move():
        """returns (damage, mp cost, max damage) of the fight policy's move"""
        nonlocal shell
        if mp >= 5 and L >= 4 and (kind in ('cat', 'cray') or ehp > 12):
            return 'gg', 5, 15 + b
        if mp >= 3: return 'bb', 3, 12 + b
        return 'atk', 0, 10 + b

    def do_move(m):
        nonlocal shell
        if m == 'gg':
            shell = False; return random.randint(8, 15) + b
        if m == 'bb':
            d = random.randint(5, 12) + b
            return max(1, d - 2) if shell else d
        if random.random() < 0.9 and not (kind == 'cat' and random.random() < 0.25):
            d = random.randint(3, 10) + b
            return max(1, d - 2) if shell else d
        return 0

    first = kind == 'nymph'
    floor_hp = 1 if stump else 0
    while True:
        turn += 1
        if first:
            enemy_act()
            if hp <= 0: return ('lose', turn, 0, mp_used)
        warned = kind == 'gar' and (gturn + 1) % 3 == 0 and not sub
        dmg = 0
        lethal = warned and hp <= hit(GAR_SPECIAL)
        if (seed or kelp) and hp < hpmax and (hp <= 0.35 * hpmax or lethal):
            if seed: seed -= 1; hp = min(hpmax, hp + SEED)
            else: kelp -= 1; hp = min(hpmax, hp + KELP)
        elif party:
            if turn == 1 or mp >= 5:          # friends burst in: first Party! is free
                if turn != 1: mp -= 5; mp_used += 5
                meter += per_cast
                if meter >= 4: return ('friend', turn, hp / hpmax, mp_used)
            elif bw: bw -= 1; mp = min(mpmax, mp + BWATER)
            else: dmg = do_move('atk')
        elif stump and (ehp <= ehp0 / 2 or turn >= 3):
            return ('friend', turn, hp / hpmax, mp_used)   # free, certain first cast
        else:
            m, cost, mx = dmg_move()
            if befriend and cost and mp - cost < 5:
                m, cost, mx = 'atk', 0, 10 + b   # keep 5 MP for the party
            nip_max = (5 + L // 2) if bubble else 0
            if befriend and mp >= 5 and (ehp <= ehp0 / 2 or ehp <= mx + nip_max):
                mp -= 5; mp_used += 5
                if random.random() < hbt_chance(L, ehp, ehp0, friends, edge, el):
                    mp = min(mpmax, mp + 5); mp_used -= 5
                    hp = min(hpmax, hp + math.floor(0.15 * hpmax))
                    return ('friend', turn, hp / hpmax, mp_used)
            else:
                mp -= cost; mp_used += cost; dmg = do_move(m)
        ehp = max(floor_hp, ehp - dmg)
        if ehp <= 0: return ('win', turn, hp / hpmax, mp_used)
        if bubble:
            if dizzy: dizzy = False
            elif not healed and hp < 0.3 * hpmax: healed = True; hp = min(hpmax, hp + math.floor(0.15 * hpmax))
            else: ehp = max(floor_hp, ehp - (random.randint(2, 5) + L // 2))
            if ehp <= 0: return ('win', turn, hp / hpmax, mp_used)
        if not first:
            enemy_act()
            if hp <= 0: return ('lose', turn, 0, mp_used)
        if turn > 80: return ('lose', turn, 0, mp_used)

RESULTS = []
def run(name, target, check, n=4000, **kw):
    random.seed(zlib.crc32(name.encode()))
    r = [fight(**kw) for _ in range(n)]
    ok = [x for x in r if x[0] != 'lose']
    wr = len(ok) / n
    fr = sum(1 for x in r if x[0] == 'friend') / n
    t = sum(x[1] for x in ok) / max(1, len(ok))
    h = sum(x[2] for x in ok) / max(1, len(ok))
    m = sum(x[3] for x in ok) / max(1, len(ok))
    s = dict(win=wr, friend=fr, turns=t, hp=h, mp=m)
    passed = check(s)
    RESULTS.append(passed)
    print(f"| {name} | {target} | {wr*100:.1f}% | {fr*100:.0f}% | {t:.1f} | {h*100:.0f}% | {m:.1f} | {'PASS' if passed else 'FAIL'} |")

def main():
    print("| Fight (start MP) | Target | Win | Friend | Turns | HP left | Net MP | |")
    print("|---|---|---|---|---|---|---|---|")
    run('Guppy L1-2 vs L1 (full)', 'win >= 99%, 2-3 turns', lambda s: s['win'] >= .99 and 2 <= s['turns'] <= 3.2, kind='guppy', el=2, L=1, bubble=False)
    run('Angelfish L2 vs L1 (full)', 'win >= 80%', lambda s: s['win'] >= .80, kind='angel', el=2, L=1, bubble=False)
    run('Old Stump: Angelfish L2 vs L1 B, scripted', 'reach the cast >= 97%', lambda s: s['friend'] >= .97, kind='angel', el=2, L=1, stump=True, mp_frac=0)
    run('Catfish L5 vs L4 B (half)', 'win >= 90%, 3-5 turns, 35-70% HP', lambda s: s['win'] >= .9 and 3 <= s['turns'] <= 5 and .35 <= s['hp'] <= .70, kind='cat', el=5, L=4, mp_frac=.5)
    run('Nymph L5 vs L4 B (half)', 'win >= 90%, 3-5 turns, 35-70% HP', lambda s: s['win'] >= .9 and 3 <= s['turns'] <= 5 and .35 <= s['hp'] <= .70, kind='nymph', el=5, L=4, mp_frac=.5)
    fightrow = {}
    def keep(st): fightrow.update(st); return st['win'] >= .97
    run('Reedwater FIGHT: Catfish L4 vs L4 B (half)', 'win >= 97% (baseline for the next two rows)', keep, kind='cat', el=4, L=4, mp_frac=.5)
    def bef(minfr):
        return lambda st: (st['friend'] >= minfr and st['win'] >= .97 and st['hp'] >= fightrow['hp'] - .05 and st['mp'] <= fightrow['mp'])
    run('Reedwater BEFRIEND: Catfish L4 vs L4 B, 0 friends (half)', 'friend >= 45%, friend-or-win >= 97%, HP left within 5 points of fighting, net MP <= fighting', bef(.45), kind='cat', el=4, L=4, mp_frac=.5, befriend=True, friends=0)
    run('Reedwater BEFRIEND: Catfish L4 vs L4 B, 3 friends (half)', 'friend >= 55%, same HP and MP rule', bef(.55), kind='cat', el=4, L=4, mp_frac=.5, befriend=True, friends=3)
    run('Befriend one level up: Catfish L5 vs L4 B, 0 friends (half)', 'friend >= 25%, friend-or-win >= 95%', lambda s: s['friend'] >= .25 and s['win'] >= .95, kind='cat', el=5, L=4, mp_frac=.5, befriend=True, friends=0)
    run('Befriend a red fish: Catfish L6 vs L3 B, 0 friends (full)', 'friend <= 15% (no cheap grind)', lambda s: s['friend'] <= .15, kind='cat', el=6, L=3, befriend=True, friends=0)
    run('Cichlid L5 vs L5 B (half)', 'win >= 95%', lambda s: s['win'] >= .95, kind='cich', el=5, L=5, mp_frac=.5)
    run('Murk near: Cichlid L6 vs L5 B (full)', 'win >= 90%, >= 30% HP', lambda s: s['win'] >= .9 and s['hp'] >= .3, kind='cich', el=6, L=5)
    run('Murk near: Crayfish L6 vs L5 B (full)', 'win >= 90%, >= 30% HP', lambda s: s['win'] >= .9 and s['hp'] >= .3, kind='cray', el=6, L=5)
    run('Murk deep: Cichlid L7 vs L6 B (half)', 'win >= 90%, >= 30% HP', lambda s: s['win'] >= .9 and s['hp'] >= .3, kind='cich', el=7, L=6, mp_frac=.5)
    run('Murk deep: Crayfish L7 vs L6 B (half)', 'win >= 90%, >= 30% HP', lambda s: s['win'] >= .9 and s['hp'] >= .3, kind='cray', el=7, L=6, mp_frac=.5)
    run('Cichlid L8 vs L7 B (half)', 'win >= 85%', lambda s: s['win'] >= .85, kind='cich', el=8, L=7, mp_frac=.5)
    run('Crayfish L8 vs L7 B (half)', 'win >= 85%', lambda s: s['win'] >= .85, kind='cray', el=8, L=7, mp_frac=.5)
    run('Edge Cichlid L10 vs L8 B (full)', 'win 35-70%', lambda s: .35 <= s['win'] <= .7, kind='cich', el=10, L=8, edge=True)
    run('Edge Crayfish L10 vs L8 B (full)', 'win 35-70%', lambda s: .35 <= s['win'] <= .7, kind='cray', el=10, L=8, edge=True)
    run('Gar vs L8 B, 3 Seed Cakes (full)', 'win >= 75%, 7-12 turns', lambda s: s['win'] >= .75 and 7 <= s['turns'] <= 12, kind='gar', el=10, L=8, seed=3)
    run('Gar vs L8 B, no items (full)', 'win <= 35%', lambda s: s['win'] <= .35, kind='gar', el=10, L=8)
    run('Gar vs L10 B, no items (full)', 'win >= 90%', lambda s: s['win'] >= .9, kind='gar', el=10, L=10)
    run('Gar vs L8 B in the sub, no items (full)', 'win >= 90%', lambda s: s['win'] >= .9, kind='gar', el=10, L=8, sub=True)
    run('Gar friendship: L8 B, 5 friends, no items (full)', 'friend >= 85%', lambda s: s['friend'] >= .85, kind='gar', el=10, L=8, party=True, friends=5)
    run('Gar friendship: L8 B, 5 friends, 2 Bubble Waters (half)', 'friend >= 85%', lambda s: s['friend'] >= .85, kind='gar', el=10, L=8, party=True, bw=2, friends=5, mp_frac=.5)
    print(f"\n{sum(RESULTS)}/{len(RESULTS)} targets met")
    sys.exit(0 if all(RESULTS) else 1)

if __name__ == '__main__':
    main()
