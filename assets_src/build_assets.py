"""Build all 16 stylized 3D travel props for Sprachreise using Sand3D (v1.6.3).

Exports ready-to-use .glb models directly into public/models/.
Run with:
    .venv\\Scripts\\python.exe assets_src/build_assets.py
"""

import math
from pathlib import Path
import sand3d as s3d
from extra_models import EXTRA_MODELS

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "models"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def export_model(filename: str, builder):
    s3d.empty_scene()
    asm = builder()
    out_path = OUT_DIR / filename
    s3d.export(asm, str(out_path))
    size_kb = out_path.stat().st_size / 1024
    print(f"  [OK] {filename:22s} ({size_kb:6.1f} KB)")


# ==============================================================================
# STATION 1: AIRPORT
# ==============================================================================

def build_suitcase():
    parts = []
    # Main rounded hardshell body
    body = s3d.extrude("body", s3d.rect(420, 220, r=42), 540)
    s3d.at(body, z=65)
    s3d.material(body, "glossy_plastic", color="#2563eb", roughness=0.25)
    parts.append(body)

    # Decorative horizontal shell ribs
    for i, z_pos in enumerate((190, 285, 380, 475)):
        rib = s3d.extrude(f"rib_{i}", s3d.rect(432, 232, r=44), 16)
        s3d.at(rib, z=z_pos)
        s3d.material(rib, "plastic", color="#1d4ed8", roughness=0.35)
        parts.append(rib)

    # Leather vertical straps
    for side, x_pos in (("L", -125), ("R", 125)):
        strap = s3d.extrude(f"strap_{side}", s3d.rect(34, 238, r=6), 550)
        s3d.at(strap, x=x_pos, z=60)
        s3d.material(strap, "leather", color="#92400e")
        parts.append(strap)

        buckle = s3d.box(f"buckle_{side}", 44, 246, 32)
        s3d.at(buckle, x=x_pos, z=320)
        s3d.material(buckle, "brass", color="#eab308")
        parts.append(buckle)

    # Travel stickers on the front (-Y)
    sticker1 = s3d.cylinder("sticker_uk", 78, 8)
    s3d.at(sticker1, x=0, y=-114, z=430, rx=90)
    s3d.material(sticker1, "plastic", color="#ef4444")
    parts.append(sticker1)

    sticker2 = s3d.extrude("sticker_sun", s3d.rect(74, 48, r=8), 8)
    s3d.at(sticker2, x=25, y=-114, z=240, rx=90, rz=14)
    s3d.material(sticker2, "plastic", color="#facc15")
    parts.append(sticker2)

    # 4 caster wheels
    for idx, (wx, wy) in enumerate(((-145, -72), (145, -72), (-145, 72), (145, 72))):
        wheel = s3d.cylinder(f"wheel_{idx}", 56, 26)
        s3d.at(wheel, x=wx, y=wy, z=28, ry=90)
        s3d.material(wheel, "rubber", color="#1e293b")
        parts.append(wheel)
        mount = s3d.cylinder(f"mount_{idx}", 30, 32)
        s3d.at(mount, x=wx, y=wy, z=40)
        s3d.material(mount, "steel", color="#94a3b8")
        parts.append(mount)

    # Top carry handle
    carry = s3d.extrude("carry_handle", s3d.rect(130, 36, r=12), 26)
    s3d.at(carry, z=605)
    s3d.material(carry, "leather", color="#78350f")
    parts.append(carry)

    # Telescopic handle rods + grip
    for side, x_pos in (("L", -70), ("R", 70)):
        rod = s3d.cylinder(f"rod_{side}", 18, 250)
        s3d.at(rod, x=x_pos, y=42, z=600)
        s3d.material(rod, "chrome")
        parts.append(rod)

    grip = s3d.extrude("grip", s3d.rect(180, 34, r=14), 34)
    s3d.at(grip, y=42, z=835)
    s3d.material(grip, "rubber", color="#1e293b")
    parts.append(grip)

    return s3d.assembly("suitcase", *parts)


def build_passport():
    parts = []
    # Small neat display plinth
    plinth = s3d.extrude("plinth", s3d.rect(340, 220, r=24), 26)
    s3d.material(plinth, "oak", color="#d6b48c")
    parts.append(plinth)

    # Passport booklet tilted back slightly so front cover faces viewer nicely
    book = []
    # White pages block inside
    pages = s3d.extrude("pages", s3d.rect(255, 36, r=6), 355)
    s3d.at(pages, z=10)
    s3d.material(pages, "plastic", color="#fef3c7", roughness=0.75)
    book.append(pages)

    # Front & back burgundy covers + spine
    front = s3d.extrude("cover_front", s3d.rect(270, 14, r=6), 375)
    s3d.at(front, y=-22, z=0)
    s3d.material(front, "leather", color="#881337", roughness=0.4)
    book.append(front)

    back = s3d.extrude("cover_back", s3d.rect(270, 14, r=6), 375)
    s3d.at(back, y=22, z=0)
    s3d.material(back, "leather", color="#881337", roughness=0.4)
    book.append(back)

    spine = s3d.extrude("spine", s3d.rect(22, 58, r=8), 375)
    s3d.at(spine, x=-130, z=0)
    s3d.material(spine, "leather", color="#6b0f2b", roughness=0.45)
    book.append(spine)

    # Gold border lines & globe emblem on front cover (-Y)
    top_bar = s3d.box("gold_top", 180, 6, 18)
    s3d.at(top_bar, x=6, y=-31, z=305)
    s3d.material(top_bar, "brass", color="#fbbf24")
    book.append(top_bar)

    bot_bar = s3d.box("gold_bot", 145, 6, 14)
    s3d.at(bot_bar, x=6, y=-31, z=70)
    s3d.material(bot_bar, "brass", color="#fbbf24")
    book.append(bot_bar)

    globe_ring = s3d.torus("globe_ring", 104, 12)
    s3d.at(globe_ring, x=6, y=-31, z=190, rx=90)
    s3d.material(globe_ring, "brass", color="#fbbf24")
    book.append(globe_ring)

    globe_h = s3d.box("globe_h", 102, 8, 10)
    s3d.at(globe_h, x=6, y=-31, z=185)
    s3d.material(globe_h, "brass", color="#fbbf24")
    book.append(globe_h)

    globe_v = s3d.box("globe_v", 10, 8, 102)
    s3d.at(globe_v, x=6, y=-31, z=139)
    s3d.material(globe_v, "brass", color="#fbbf24")
    book.append(globe_v)

    # Boarding pass peeking out the top
    ticket = s3d.extrude("boarding_pass", s3d.rect(145, 8, r=3), 130)
    s3d.at(ticket, x=35, y=0, z=310, ry=10)
    s3d.material(ticket, "plastic", color="#38bdf8", roughness=0.5)
    book.append(ticket)

    ticket_stripe = s3d.box("ticket_stripe", 146, 10, 26)
    s3d.at(ticket_stripe, x=37, y=0, z=395, ry=10)
    s3d.material(ticket_stripe, "plastic", color="#f59e0b")
    book.append(ticket_stripe)

    book_grp = s3d.group("passport_book", *book)
    s3d.at(book_grp, y=15, z=24, rx=-16)
    parts.append(book_grp)

    return s3d.assembly("passport", *parts)


def build_airplane():
    parts = []
    # Fuselage along Y (nose at -Y, tail at +Y)
    fuse = s3d.cylinder("fuselage", 210, 760)
    s3d.at(fuse, y=380, z=240, rx=90)
    s3d.material(fuse, "glossy_plastic", color="#f8fafc", roughness=0.2)
    parts.append(fuse)

    # Nose dome (pointing toward -Y: rx=+90 maps +Z to -Y)
    nose = s3d.dome("nose", 210, 175)
    s3d.at(nose, y=-380, z=240, rx=90)
    s3d.material(nose, "glossy_plastic", color="#f8fafc", roughness=0.2)
    parts.append(nose)

    # Nose accent cap
    nose_tip = s3d.dome("nose_tip", 112, 48)
    s3d.at(nose_tip, y=-515, z=240, rx=90)
    s3d.material(nose_tip, "glossy_plastic", color="#2563eb")
    parts.append(nose_tip)

    # Tail cone (pointing toward +Y: rx=-90 maps +Z to +Y)
    tail_cone = s3d.cone("tail_cone", 210, 260, d2=65)
    s3d.at(tail_cone, y=380, z=240, rx=-90)
    s3d.material(tail_cone, "glossy_plastic", color="#2563eb", roughness=0.25)
    parts.append(tail_cone)

    # Blue fuselage belly stripe
    stripe = s3d.cylinder("belly_stripe", 214, 720)
    s3d.at(stripe, y=360, z=210, rx=90)
    s3d.material(stripe, "glossy_plastic", color="#3b82f6")
    parts.append(stripe)

    # Cockpit windshield
    cockpit = s3d.extrude("cockpit", s3d.rect(145, 78, r=28), 52)
    s3d.at(cockpit, y=-330, z=280, rx=20)
    s3d.material(cockpit, "glossy_plastic", color="#0ea5e9", roughness=0.08)
    parts.append(cockpit)

    # Cabin windows along both sides
    for idx, wy in enumerate((-190, -90, 10, 110, 210)):
        win = s3d.cylinder(f"win_{idx}", 44, 218)
        s3d.at(win, x=-109, y=wy, z=265, ry=90)
        s3d.material(win, "glossy_plastic", color="#38bdf8", roughness=0.1)
        parts.append(win)

    # Swept main wings
    for side, sgn in (("L", -1), ("R", 1)):
        wing = s3d.extrude(f"wing_{side}", s3d.rect(470, 175, r=24), 28)
        s3d.at(wing, x=sgn * 265, y=25, z=205, rz=sgn * -14)
        s3d.material(wing, "glossy_plastic", color="#e2e8f0", roughness=0.25)
        parts.append(wing)

        wingtip = s3d.extrude(f"wingtip_{side}", s3d.rect(36, 130, r=10), 68)
        s3d.at(wingtip, x=sgn * 485, y=80, z=215, ry=sgn * 18)
        s3d.material(wingtip, "glossy_plastic", color="#f59e0b")
        parts.append(wingtip)

        # Under-wing turbofan engine
        eng = s3d.cylinder(f"engine_{side}", 98, 175)
        s3d.at(eng, x=sgn * 235, y=70, z=155, rx=90)
        s3d.material(eng, "painted_metal", color="#2563eb")
        parts.append(eng)

        intake = s3d.cylinder(f"intake_{side}", 76, 182)
        s3d.at(intake, x=sgn * 235, y=72, z=155, rx=90)
        s3d.material(intake, "rubber", color="#1e293b")
        parts.append(intake)

    # Vertical tailfin + horizontal stabilizers
    fin = s3d.wedge("tail_fin", 34, 215, 250, top=18)
    s3d.at(fin, y=475, z=305)
    s3d.material(fin, "glossy_plastic", color="#2563eb")
    parts.append(fin)

    fin_stripe = s3d.box("fin_stripe", 38, 135, 38)
    s3d.at(fin_stripe, y=485, z=435)
    s3d.material(fin_stripe, "plastic", color="#facc15")
    parts.append(fin_stripe)

    hstab = s3d.extrude("h_stab", s3d.rect(390, 105, r=18), 22)
    s3d.at(hstab, y=505, z=270)
    s3d.material(hstab, "glossy_plastic", color="#e2e8f0")
    parts.append(hstab)

    # Landing gear struts + wheels
    for idx, (gx, gy) in enumerate(((0, -290), (-115, 30), (115, 30))):
        strut = s3d.cylinder(f"strut_{idx}", 20, 125)
        s3d.at(strut, x=gx, y=gy, z=42)
        s3d.material(strut, "steel")
        parts.append(strut)

        wheel = s3d.cylinder(f"gear_w_{idx}", 72, 34)
        s3d.at(wheel, x=gx - 17, y=gy, z=36, ry=90)
        s3d.material(wheel, "rubber", color="#1e293b")
        parts.append(wheel)

    return s3d.assembly("airplane", *parts)


def build_departure_board():
    parts = []
    # Base plinth
    base = s3d.extrude("base", s3d.rect(620, 220, r=28), 38)
    s3d.material(base, "painted_metal", color="#334155")
    parts.append(base)

    # Two brushed steel pillars
    for side, px in (("L", -210), ("R", 210)):
        post = s3d.cylinder(f"post_{side}", 42, 740)
        s3d.at(post, x=px, z=30)
        s3d.material(post, "brushed_steel")
        parts.append(post)

    # Main display cabinet
    frame = s3d.extrude("board_frame", s3d.rect(650, 95, r=24), 470)
    s3d.at(frame, z=460)
    s3d.material(frame, "painted_metal", color="#1e293b")
    parts.append(frame)

    # Header bar (blue)
    header = s3d.extrude("header", s3d.rect(600, 18, r=8), 88)
    s3d.at(header, y=-48, z=820)
    s3d.material(header, "glossy_plastic", color="#2563eb")
    parts.append(header)

    # Gate number badge on header
    badge = s3d.extrude("gate_badge", s3d.rect(120, 22, r=8), 64)
    s3d.at(badge, x=210, y=-50, z=832)
    s3d.material(badge, "light", color="#facc15", emission=2.5)
    parts.append(badge)

    # Glowing departure flight rows
    row_colors = ("#38bdf8", "#facc15", "#4ade80", "#f8fafc")
    for idx, col in enumerate(row_colors):
        z_row = 740 - idx * 72
        bar_l = s3d.box(f"row_l_{idx}", 320, 12, 34)
        s3d.at(bar_l, x=-115, y=-47, z=z_row)
        s3d.material(bar_l, "light", color=col, emission=1.8)
        parts.append(bar_l)

        bar_r = s3d.box(f"row_r_{idx}", 145, 12, 34)
        s3d.at(bar_r, x=190, y=-47, z=z_row)
        s3d.material(bar_r, "light", color="#facc15", emission=1.6)
        parts.append(bar_r)

    # Small glowing beacon dome on top
    beacon = s3d.dome("beacon", 85, 55)
    s3d.at(beacon, z=930)
    s3d.material(beacon, "light", color="#38bdf8", emission=2.2)
    parts.append(beacon)

    return s3d.assembly("departure_board", *parts)


# ==============================================================================
# STATION 2: TRAIN STATION
# ==============================================================================

def build_train():
    parts = []
    # Undercarriage chassis (along X: front at +X or -X; let's build along X, front at -X)
    chassis = s3d.extrude("chassis", s3d.rect(1120, 320, r=24), 85)
    s3d.at(chassis, z=75)
    s3d.material(chassis, "painted_metal", color="#334155")
    parts.append(chassis)

    # 6 wheels (3 per side)
    for side_i, wy in enumerate((-158, 158)):
        for wi, wx in enumerate((-360, 0, 360)):
            wheel = s3d.cylinder(f"wheel_{side_i}_{wi}", 118, 36)
            s3d.at(wheel, x=wx, y=wy - 18, z=59, rx=90)
            s3d.material(wheel, "steel", color="#475569")
            parts.append(wheel)
            hub = s3d.cylinder(f"hub_{side_i}_{wi}", 56, 44)
            s3d.at(hub, x=wx, y=wy - 22, z=59, rx=90)
            s3d.material(hub, "brass")
            parts.append(hub)

    # Main crimson coach body
    body = s3d.extrude("body", s3d.rect(1140, 355, r=42), 340)
    s3d.at(body, z=150)
    s3d.material(body, "glossy_plastic", color="#dc2626", roughness=0.22)
    parts.append(body)

    # Cream express stripe around body
    stripe = s3d.extrude("stripe", s3d.rect(1152, 366, r=44), 56)
    s3d.at(stripe, z=225)
    s3d.material(stripe, "plastic", color="#fef3c7")
    parts.append(stripe)

    # Rounded dark roof
    roof = s3d.extrude("roof", s3d.rect(1080, 325, r=50), 58)
    s3d.at(roof, z=485)
    s3d.material(roof, "painted_metal", color="#475569")
    parts.append(roof)

    # Roof vents
    for vi, vx in enumerate((-280, 0, 280)):
        vent = s3d.extrude(f"vent_{vi}", s3d.rect(120, 120, r=18), 32)
        s3d.at(vent, x=vx, z=535)
        s3d.material(vent, "aluminium")
        parts.append(vent)

    # Side passenger windows (bright sky blue)
    for wi, wx in enumerate((-340, -170, 0, 170, 340)):
        win = s3d.extrude(f"side_win_{wi}", s3d.rect(122, 368, r=16), 130)
        s3d.at(win, x=wx, z=310)
        s3d.material(win, "glossy_plastic", color="#7dd3fc", roughness=0.08)
        parts.append(win)

    # Front windshield & cab nose (-X)
    front_win = s3d.extrude("front_win", s3d.rect(16, 265, r=6), 140)
    s3d.at(front_win, x=-568, z=310)
    s3d.material(front_win, "glossy_plastic", color="#38bdf8", roughness=0.08)
    parts.append(front_win)

    # Front bright headlights
    for hi, hy in enumerate((-100, 100)):
        lamp = s3d.cylinder(f"headlight_{hi}", 54, 24)
        s3d.at(lamp, x=-580, y=hy, z=215, ry=90)
        s3d.material(lamp, "light", color="#fef08a", emission=3.0)
        parts.append(lamp)

        buf = s3d.cylinder(f"buffer_{hi}", 48, 52)
        s3d.at(buf, x=-604, y=hy, z=120, ry=90)
        s3d.material(buf, "steel", color="#334155")
        parts.append(buf)

    return s3d.assembly("train", *parts)


def build_ticket_machine():
    parts = []
    # Base plinth
    plinth = s3d.extrude("plinth", s3d.rect(420, 340, r=22), 55)
    s3d.material(plinth, "painted_metal", color="#1e293b")
    parts.append(plinth)

    # Main kiosk tower
    tower = s3d.extrude("tower", s3d.rect(380, 290, r=24), 760)
    s3d.at(tower, z=55)
    s3d.material(tower, "glossy_plastic", color="#1d4ed8", roughness=0.28)
    parts.append(tower)

    # Silver front face plate
    panel = s3d.extrude("front_panel", s3d.rect(325, 22, r=8), 560)
    s3d.at(panel, y=-142, z=160)
    s3d.material(panel, "aluminium", color="#e2e8f0")
    parts.append(panel)

    # Glowing header sign
    header = s3d.extrude("header", s3d.rect(330, 32, r=10), 92)
    s3d.at(header, y=-146, z=735)
    s3d.material(header, "light", color="#facc15", emission=2.0)
    parts.append(header)

    # Bright blue touchscreen
    screen = s3d.extrude("screen", s3d.rect(250, 18, r=7), 210)
    s3d.at(screen, y=-152, z=470)
    s3d.material(screen, "light", color="#38bdf8", emission=1.6)
    parts.append(screen)

    # Keypad / card reader
    keypad = s3d.box("keypad", 120, 26, 95)
    s3d.at(keypad, x=65, y=-156, z=330)
    s3d.material(keypad, "painted_metal", color="#334155")
    parts.append(keypad)

    # Dispenser tray + white/orange ticket sticking out!
    slot = s3d.box("disp_slot", 165, 36, 48)
    s3d.at(slot, x=-55, y=-156, z=215)
    s3d.material(slot, "rubber", color="#0f172a")
    parts.append(slot)

    ticket = s3d.box("ticket_out", 95, 90, 8)
    s3d.at(ticket, x=-55, y=-192, z=235)
    s3d.material(ticket, "plastic", color="#fb923c")
    parts.append(ticket)

    # Protective little top canopy
    canopy = s3d.extrude("canopy", s3d.rect(400, 360, r=24), 45)
    s3d.at(canopy, y=-30, z=815)
    s3d.material(canopy, "painted_metal", color="#1e3a8a")
    parts.append(canopy)

    return s3d.assembly("ticket_machine", *parts)


def build_station_clock():
    parts = []
    # Stepped Victorian cast-iron base
    b1 = s3d.cylinder("base1", 290, 55)
    s3d.material(b1, "painted_metal", color="#1e293b")
    parts.append(b1)

    b2 = s3d.cone("base2", 240, 110, d2=120)
    s3d.at(b2, z=55)
    s3d.material(b2, "painted_metal", color="#1e293b")
    parts.append(b2)

    # Tall post
    post = s3d.cylinder("post", 72, 740)
    s3d.at(post, z=160)
    s3d.material(post, "painted_metal", color="#1e293b")
    parts.append(post)

    # Decorative brass collar rings
    for ci, cz in enumerate((175, 520, 860)):
        ring = s3d.torus(f"collar_{ci}", 86, 20)
        s3d.at(ring, z=cz)
        s3d.material(ring, "brass")
        parts.append(ring)

    # Double-sided round brass clock casing
    casing = s3d.cylinder("clock_case", 340, 125)
    s3d.at(casing, y=62, z=1040, rx=90)
    s3d.material(casing, "brass", color="#d97706")
    parts.append(casing)

    # Cream clock faces on both front (-Y) and back (+Y)
    dial = s3d.cylinder("clock_dial", 290, 134)
    s3d.at(dial, y=67, z=1040, rx=90)
    s3d.material(dial, "light", color="#fffbeb", emission=0.8)
    parts.append(dial)

    # Clock hands on front (-Y) and back (+Y)
    for side, y_pos in (("F", -71), ("B", 71)):
        h_hand = s3d.box(f"hour_{side}", 18, 12, 95)
        s3d.at(h_hand, x=-28, y=y_pos, z=1040, ry=48)
        s3d.material(h_hand, "painted_metal", color="#0f172a")
        parts.append(h_hand)

        m_hand = s3d.box(f"min_{side}", 14, 12, 128)
        s3d.at(m_hand, x=32, y=y_pos, z=1040, ry=-38)
        s3d.material(m_hand, "painted_metal", color="#0f172a")
        parts.append(m_hand)

        pin = s3d.cylinder(f"pin_{side}", 28, 18)
        s3d.at(pin, y=y_pos + (9 if side == "F" else -9), z=1040, rx=90)
        s3d.material(pin, "brass")
        parts.append(pin)

    # Top ornamental finial
    finial_stem = s3d.cone("finial_stem", 72, 65, d2=20)
    s3d.at(finial_stem, z=1205)
    s3d.material(finial_stem, "brass")
    parts.append(finial_stem)

    finial_ball = s3d.sphere("finial_ball", 52)
    s3d.at(finial_ball, z=1262)
    s3d.material(finial_ball, "brass")
    parts.append(finial_ball)

    return s3d.assembly("station_clock", *parts)


def build_bench():
    parts = []
    # 3 iron leg frames
    for idx, lx in enumerate((-320, 0, 320)):
        f_leg = s3d.box(f"f_leg_{idx}", 34, 42, 240)
        s3d.at(f_leg, x=lx, y=-135, z=0)
        s3d.material(f_leg, "painted_metal", color="#1e293b")
        parts.append(f_leg)

        b_leg = s3d.box(f"b_leg_{idx}", 34, 42, 480)
        s3d.at(b_leg, x=lx, y=135, z=0)
        s3d.material(b_leg, "painted_metal", color="#1e293b")
        parts.append(b_leg)

        seat_bar = s3d.box(f"s_bar_{idx}", 34, 315, 34)
        s3d.at(seat_bar, x=lx, y=0, z=210)
        s3d.material(seat_bar, "painted_metal", color="#1e293b")
        parts.append(seat_bar)

    # Side armrests
    for side, lx in (("L", -320), ("R", 320)):
        arm = s3d.extrude(f"arm_{side}", s3d.rect(46, 290, r=10), 28)
        s3d.at(arm, x=lx, y=0, z=325)
        s3d.material(arm, "painted_metal", color="#1e293b")
        parts.append(arm)

        arm_post = s3d.box(f"arm_post_{side}", 34, 34, 110)
        s3d.at(arm_post, x=lx, y=-125, z=225)
        s3d.material(arm_post, "painted_metal", color="#1e293b")
        parts.append(arm_post)

    # 4 oak seat slats
    for i, sy in enumerate((-110, -38, 34, 106)):
        slat = s3d.extrude(f"seat_{i}", s3d.rect(760, 58, r=8), 26)
        s3d.at(slat, y=sy, z=242)
        s3d.material(slat, "oak", color="#b45309")
        parts.append(slat)

    # 3 oak backrest slats
    for i, sz in enumerate((330, 405, 480)):
        bslat = s3d.extrude(f"back_{i}", s3d.rect(760, 26, r=6), 58)
        s3d.at(bslat, y=118, z=sz)
        s3d.material(bslat, "oak", color="#c26412")
        parts.append(bslat)

    return s3d.assembly("bench", *parts)


# ==============================================================================
# STATION 3: COZY CAFE
# ==============================================================================

def build_coffee_cup():
    parts = []
    # Saucer
    saucer_base = s3d.cone("saucer", 160, 26, d2=260)
    s3d.material(saucer_base, "ceramic", color="#fffbeb")
    parts.append(saucer_base)

    saucer_rim = s3d.torus("saucer_rim", 252, 16)
    s3d.at(saucer_rim, z=18)
    s3d.material(saucer_rim, "brass", color="#f59e0b")
    parts.append(saucer_rim)

    # Cup base & hollow ceramic wall
    cup_bottom = s3d.cylinder("cup_bot", 136, 26)
    s3d.at(cup_bottom, z=22)
    s3d.material(cup_bottom, "ceramic", color="#ffffff")
    parts.append(cup_bottom)

    cup_wall = s3d.tube("cup_wall", 168, 138, 165)
    s3d.at(cup_wall, z=32)
    s3d.material(cup_wall, "ceramic", color="#ffffff")
    parts.append(cup_wall)

    # Mint decorative band around mug
    band = s3d.tube("cup_band", 172, 166, 36)
    s3d.at(band, z=100)
    s3d.material(band, "ceramic", color="#10b981")
    parts.append(band)

    # Espresso + creamy latte foam inside
    coffee = s3d.cylinder("coffee_fill", 142, 132)
    s3d.at(coffee, z=44)
    s3d.material(coffee, "glossy_plastic", color="#5c2d0c", roughness=0.2)
    parts.append(coffee)

    foam = s3d.dome("latte_foam", 134, 24)
    s3d.at(foam, z=172)
    s3d.material(foam, "plastic", color="#fde68a", roughness=0.75)
    parts.append(foam)

    # Curved handle
    handle = s3d.torus("cup_handle", 96, 22)
    s3d.at(handle, x=88, z=115, rx=90)
    s3d.material(handle, "ceramic", color="#ffffff")
    parts.append(handle)

    # Little silver spoon resting on saucer
    spoon_handle = s3d.extrude("spoon_h", s3d.rect(125, 16, r=6), 8)
    s3d.at(spoon_handle, x=-25, y=-95, z=28, rz=18)
    s3d.material(spoon_handle, "chrome")
    parts.append(spoon_handle)

    spoon_bowl = s3d.cylinder("spoon_b", 36, 10)
    s3d.at(spoon_bowl, x=40, y=-75, z=27)
    s3d.material(spoon_bowl, "chrome")
    parts.append(spoon_bowl)

    return s3d.assembly("coffee_cup", *parts)


def build_cake_plate():
    parts = []
    # White dessert plate with gold rim
    plate = s3d.cone("plate", 210, 22, d2=300)
    s3d.material(plate, "ceramic", color="#ffffff")
    parts.append(plate)

    plate_rim = s3d.torus("plate_rim", 292, 14)
    s3d.at(plate_rim, z=16)
    s3d.material(plate_rim, "brass", color="#fbbf24")
    parts.append(plate_rim)

    # 3-layer miniature café cake!
    l1 = s3d.cylinder("sponge_1", 190, 42)
    s3d.at(l1, z=20)
    s3d.material(l1, "plastic", color="#f59e0b", roughness=0.75)
    parts.append(l1)

    cream1 = s3d.cylinder("cream_1", 194, 18)
    s3d.at(cream1, z=62)
    s3d.material(cream1, "plastic", color="#fff7ed", roughness=0.55)
    parts.append(cream1)

    l2 = s3d.cylinder("sponge_2", 190, 42)
    s3d.at(l2, z=80)
    s3d.material(l2, "plastic", color="#d97706", roughness=0.75)
    parts.append(l2)

    # Rich chocolate glaze on top
    glaze = s3d.cylinder("choco_glaze", 198, 28)
    s3d.at(glaze, z=120)
    s3d.material(glaze, "glossy_plastic", color="#5c2d0c", roughness=0.18)
    parts.append(glaze)

    # Whipped cream rosettes + bright red strawberries on top
    for i in range(6):
        ang = math.radians(i * 60)
        rx, ry = math.cos(ang) * 66, math.sin(ang) * 66
        puff = s3d.dome(f"puff_{i}", 42, 26)
        s3d.at(puff, x=rx, y=ry, z=146)
        s3d.material(puff, "plastic", color="#fffbeb", roughness=0.6)
        parts.append(puff)

    # Center strawberry + leaf
    berry = s3d.cone("berry", 46, 52, d2=12)
    s3d.at(berry, z=146)
    s3d.material(berry, "glossy_plastic", color="#ef4444", roughness=0.25)
    parts.append(berry)

    leaf = s3d.cylinder("berry_leaf", 32, 10)
    s3d.at(leaf, z=146)
    s3d.material(leaf, "plastic", color="#16a34a")
    parts.append(leaf)

    # Little silver fork beside cake
    fork = s3d.extrude("fork", s3d.rect(145, 20, r=6), 8)
    s3d.at(fork, x=25, y=-118, z=24, rz=-12)
    s3d.material(fork, "chrome")
    parts.append(fork)

    return s3d.assembly("cake_plate", *parts)


def build_bistro_table():
    parts = []
    # Cast-iron base feet
    for ang in (0, 90):
        foot = s3d.extrude(f"foot_{ang}", s3d.rect(360, 48, r=18), 32)
        s3d.at(foot, rz=ang)
        s3d.material(foot, "painted_metal", color="#1e293b")
        parts.append(foot)

    # Pedestal pole
    pole = s3d.cylinder("pole", 64, 520)
    s3d.at(pole, z=26)
    s3d.material(pole, "painted_metal", color="#1e293b")
    parts.append(pole)

    collar = s3d.cone("pole_collar", 150, 70, d2=72)
    s3d.at(collar, z=28)
    s3d.material(collar, "painted_metal", color="#1e293b")
    parts.append(collar)

    # Round marble tabletop + brass rim
    top = s3d.cylinder("tabletop", 620, 34)
    s3d.at(top, z=540)
    s3d.material(top, "marble", color="#fafaf9")
    parts.append(top)

    rim = s3d.torus("table_rim", 620, 26)
    s3d.at(rim, z=544)
    s3d.material(rim, "brass", color="#d97706")
    parts.append(rim)

    # Two cozy bistro chairs on left (-X) and right (+X)
    for side, sgn in (("L", -1), ("R", 1)):
        cx = sgn * 455
        chair_parts = []
        seat = s3d.cylinder(f"c_seat_{side}", 270, 28)
        s3d.at(seat, z=285)
        s3d.material(seat, "oak", color="#b45309")
        chair_parts.append(seat)

        for li, (lx, ly) in enumerate(((-82, -82), (82, -82), (-82, 82), (82, 82))):
            leg = s3d.cylinder(f"c_leg_{side}_{li}", 22, 290)
            s3d.at(leg, x=lx, y=ly, z=0)
            s3d.material(leg, "painted_metal", color="#1e293b")
            chair_parts.append(leg)

        # Backrest posts on the outer edge
        for bi, by in enumerate((-78, 78)):
            bpost = s3d.cylinder(f"c_bp_{side}_{bi}", 22, 275)
            s3d.at(bpost, x=sgn * 105, y=by, z=290)
            s3d.material(bpost, "painted_metal", color="#1e293b")
            chair_parts.append(bpost)

        backrest = s3d.extrude(f"c_back_{side}", s3d.rect(28, 220, r=10), 110)
        s3d.at(backrest, x=sgn * 105, z=455)
        s3d.material(backrest, "oak", color="#c26412")
        chair_parts.append(backrest)

        cgrp = s3d.group(f"chair_{side}", *chair_parts)
        s3d.at(cgrp, x=cx)
        parts.append(cgrp)

    return s3d.assembly("bistro_table", *parts)


def build_menu_board():
    parts = []
    # A-frame front and back panels
    for side, sgn, tilt in (("F", -1, -15), ("B", 1, 15)):
        panel_parts = []
        frame = s3d.extrude(f"frame_{side}", s3d.rect(420, 32, r=12), 620)
        s3d.material(frame, "oak", color="#b45309")
        panel_parts.append(frame)

        chalk = s3d.box(f"chalk_{side}", 350, 38, 490)
        s3d.at(chalk, z=80)
        s3d.material(chalk, "painted_metal", color="#1e293b", roughness=0.85)
        panel_parts.append(chalk)

        # Chalk menu lines on outer surface
        if side == "F":
            header = s3d.box("menu_hdr", 210, 10, 34)
            s3d.at(header, y=-20, z=490)
            s3d.material(header, "plastic", color="#facc15")
            panel_parts.append(header)

            for li, (lw, lz, col) in enumerate((
                (260, 405, "#f8fafc"),
                (220, 330, "#fed7aa"),
                (250, 255, "#f8fafc"),
                (190, 180, "#a7f3d0"),
            )):
                line = s3d.box(f"mline_{li}", lw, 10, 24)
                s3d.at(line, x=-15, y=-20, z=lz)
                s3d.material(line, "plastic", color=col)
                panel_parts.append(line)

        pgrp = s3d.group(f"side_{side}", *panel_parts)
        s3d.at(pgrp, y=sgn * 165, z=10, rx=tilt)
        parts.append(pgrp)

    # Top brass hinge bar connecting both sides
    hinge = s3d.cylinder("top_hinge", 34, 430)
    s3d.at(hinge, x=-215, z=605, ry=90)
    s3d.material(hinge, "brass")
    parts.append(hinge)

    return s3d.assembly("menu_board", *parts)


# ==============================================================================
# STATION 4: LONDON SQUARE
# ==============================================================================

def build_phone_booth():
    parts = []
    # Concrete base plinth
    plinth = s3d.extrude("plinth", s3d.rect(470, 470, r=16), 60)
    s3d.material(plinth, "concrete", color="#475569")
    parts.append(plinth)

    # Iconic K6 London Red body shell
    base_skirt = s3d.box("skirt", 430, 430, 145)
    s3d.at(base_skirt, z=60)
    s3d.material(base_skirt, "glossy_plastic", color="#dc2626", roughness=0.22)
    parts.append(base_skirt)

    # 4 sturdy red corner pillars
    for idx, (px, py) in enumerate(((-185, -185), (185, -185), (-185, 185), (185, 185))):
        col = s3d.box(f"corner_{idx}", 62, 62, 760)
        s3d.at(col, x=px, y=py, z=200)
        s3d.material(col, "glossy_plastic", color="#dc2626", roughness=0.22)
        parts.append(col)

    # Glowing bright glass core inside
    glass_core = s3d.box("glass_core", 365, 365, 640)
    s3d.at(glass_core, z=205)
    s3d.material(glass_core, "glossy_plastic", color="#bae6fd", roughness=0.08)
    parts.append(glass_core)

    # Classic red mullion bars (horizontal & vertical grid) on all sides
    for hi, hz in enumerate((340, 480, 620, 760)):
        hbar = s3d.box(f"hbar_{hi}", 426, 426, 22)
        s3d.at(hbar, z=hz)
        s3d.material(hbar, "glossy_plastic", color="#dc2626", roughness=0.22)
        parts.append(hbar)

    for vi, vo in enumerate((-72, 72)):
        vx = s3d.box(f"vbar_x_{vi}", 20, 428, 635)
        s3d.at(vx, x=vo, z=205)
        s3d.material(vx, "glossy_plastic", color="#dc2626", roughness=0.22)
        parts.append(vx)

        vy = s3d.box(f"vbar_y_{vi}", 428, 20, 635)
        s3d.at(vy, y=vo, z=205)
        s3d.material(vy, "glossy_plastic", color="#dc2626", roughness=0.22)
        parts.append(vy)

    # Brass door handle on front (-Y)
    handle = s3d.box("door_handle", 18, 24, 95)
    s3d.at(handle, x=150, y=-220, z=430)
    s3d.material(handle, "brass")
    parts.append(handle)

    # Upper cornice + white illuminated "TELEPHONE" transom band
    transom_red = s3d.box("transom_red", 440, 440, 125)
    s3d.at(transom_red, z=840)
    s3d.material(transom_red, "glossy_plastic", color="#dc2626", roughness=0.22)
    parts.append(transom_red)

    sign_x = s3d.box("sign_x", 320, 448, 62)
    s3d.at(sign_x, z=872)
    s3d.material(sign_x, "light", color="#ffffff", emission=1.2)
    parts.append(sign_x)

    sign_y = s3d.box("sign_y", 448, 320, 62)
    s3d.at(sign_y, z=872)
    s3d.material(sign_y, "light", color="#ffffff", emission=1.2)
    parts.append(sign_y)

    # Iconic K6 domed roof
    cornice = s3d.extrude("cornice", s3d.rect(470, 470, r=24), 38)
    s3d.at(cornice, z=960)
    s3d.material(cornice, "glossy_plastic", color="#dc2626", roughness=0.22)
    parts.append(cornice)

    roof_dome = s3d.dome("roof_dome", 435, 125)
    s3d.at(roof_dome, z=992)
    s3d.material(roof_dome, "glossy_plastic", color="#dc2626", roughness=0.22)
    parts.append(roof_dome)

    return s3d.assembly("phone_booth", *parts)


def build_double_decker():
    parts = []
    # Undercarriage
    base = s3d.extrude("chassis", s3d.rect(960, 350, r=28), 65)
    s3d.at(base, z=70)
    s3d.material(base, "painted_metal", color="#1e293b")
    parts.append(base)

    # 4 rubber wheels with silver hubcaps
    for si, wy in enumerate((-175, 175)):
        for wi, wx in enumerate((-295, 295)):
            wheel = s3d.cylinder(f"bus_w_{si}_{wi}", 145, 52)
            s3d.at(wheel, x=wx, y=wy - 26, z=72, rx=90)
            s3d.material(wheel, "rubber", color="#0f172a")
            parts.append(wheel)

            hub = s3d.cylinder(f"bus_h_{si}_{wi}", 72, 60)
            s3d.at(hub, x=wx, y=wy - 30, z=72, rx=90)
            s3d.material(hub, "aluminium")
            parts.append(hub)

    # Lower & Upper iconic London Red decks
    body = s3d.extrude("bus_body", s3d.rect(990, 385, r=42), 545)
    s3d.at(body, z=125)
    s3d.material(body, "glossy_plastic", color="#dc2626", roughness=0.22)
    parts.append(body)

    # Cream belt line between decks
    belt = s3d.extrude("bus_belt", s3d.rect(1002, 396, r=44), 38)
    s3d.at(belt, z=380)
    s3d.material(belt, "plastic", color="#fef3c7")
    parts.append(belt)

    # Roof cap
    roof = s3d.extrude("bus_roof", s3d.rect(940, 355, r=48), 38)
    s3d.at(roof, z=665)
    s3d.material(roof, "glossy_plastic", color="#b91c1c", roughness=0.28)
    parts.append(roof)

    # Lower deck & Upper deck side windows
    for wi, wx in enumerate((-325, -165, -5, 155, 315)):
        w_low = s3d.extrude(f"wl_{wi}", s3d.rect(128, 398, r=14), 130)
        s3d.at(w_low, x=wx, z=225)
        s3d.material(w_low, "glossy_plastic", color="#7dd3fc", roughness=0.08)
        parts.append(w_low)

        w_up = s3d.extrude(f"wu_{wi}", s3d.rect(128, 398, r=14), 145)
        s3d.at(w_up, x=wx, z=470)
        s3d.material(w_up, "glossy_plastic", color="#bae6fd", roughness=0.08)
        parts.append(w_up)

    # Front windshields (-X)
    f_low = s3d.extrude("front_low_w", s3d.rect(18, 295, r=6), 135)
    s3d.at(f_low, x=-492, z=225)
    s3d.material(f_low, "glossy_plastic", color="#38bdf8", roughness=0.08)
    parts.append(f_low)

    f_up = s3d.extrude("front_up_w", s3d.rect(18, 295, r=6), 145)
    s3d.at(f_up, x=-492, z=470)
    s3d.material(f_up, "glossy_plastic", color="#7dd3fc", roughness=0.08)
    parts.append(f_up)

    # Illuminated front destination sign ("LONDON")
    dest = s3d.box("dest_sign", 20, 210, 42)
    s3d.at(dest, x=-494, z=398)
    s3d.material(dest, "light", color="#facc15", emission=2.0)
    parts.append(dest)

    # Chrome grille & glowing yellow headlights
    grille = s3d.box("grille", 16, 150, 62)
    s3d.at(grille, x=-495, z=145)
    s3d.material(grille, "chrome")
    parts.append(grille)

    for hi, hy in enumerate((-125, 125)):
        hl = s3d.cylinder(f"hl_{hi}", 46, 20)
        s3d.at(hl, x=-505, y=hy, z=175, ry=90)
        s3d.material(hl, "light", color="#fef08a", emission=2.8)
        parts.append(hl)

    return s3d.assembly("double_decker", *parts)


def build_clock_tower():
    parts = []
    # Stone pedestal base
    plinth = s3d.box("plinth", 540, 540, 120)
    s3d.material(plinth, "concrete", color="#d6b48c")
    parts.append(plinth)

    # Main sandstone tower shaft
    shaft = s3d.box("shaft", 430, 430, 920)
    s3d.at(shaft, z=120)
    s3d.material(shaft, "concrete", color="#e7cba9")
    parts.append(shaft)

    # Vertical Gothic corner pilasters
    for idx, (px, py) in enumerate(((-205, -205), (205, -205), (-205, 205), (205, 205))):
        pil = s3d.box(f"pil_{idx}", 52, 52, 1340)
        s3d.at(pil, x=px, y=py, z=120)
        s3d.material(pil, "concrete", color="#c9a57b")
        parts.append(pil)

    # Decorative vertical recess stripes on faces
    for sz in (320, 540, 760):
        trim = s3d.box(f"trim_{sz}", 462, 462, 26)
        s3d.at(trim, z=sz)
        s3d.material(trim, "brass", color="#d97706")
        parts.append(trim)

    # Clock belfry block (slightly wider)
    belfry = s3d.box("belfry", 485, 485, 420)
    s3d.at(belfry, z=1040)
    s3d.material(belfry, "concrete", color="#dfbe95")
    parts.append(belfry)

    # Gold cornice bands below and above clock faces
    for ci, cz in enumerate((1035, 1455)):
        band = s3d.box(f"gold_band_{ci}", 525, 525, 34)
        s3d.at(band, z=cz)
        s3d.material(band, "brass", color="#eab308")
        parts.append(band)

    # 4 Glowing Clock Faces (all 4 sides!)
    dial_x = s3d.cylinder("dial_x", 310, 505)
    s3d.at(dial_x, x=-252.5, z=1250, ry=90)
    s3d.material(dial_x, "light", color="#fffbeb", emission=1.2)
    parts.append(dial_x)

    dial_y = s3d.cylinder("dial_y", 310, 505)
    s3d.at(dial_y, y=252.5, z=1250, rx=90)
    s3d.material(dial_y, "light", color="#fffbeb", emission=1.2)
    parts.append(dial_y)

    # Clock hands on all 4 sides
    for side, pos, rot in (
        ("S", (0, -256, 1250), (0, 0, 0)),
        ("N", (0, 256, 1250), (0, 0, 180)),
        ("W", (-256, 0, 1250), (0, 0, -90)),
        ("E", (256, 0, 1250), (0, 0, 90)),
    ):
        hands = []
        hh = s3d.box(f"hh_{side}", 20, 12, 92)
        s3d.at(hh, x=-24, ry=42)
        s3d.material(hh, "painted_metal", color="#0f172a")
        hands.append(hh)

        mh = s3d.box(f"mh_{side}", 14, 12, 125)
        s3d.at(mh, x=26, ry=-34)
        s3d.material(mh, "painted_metal", color="#0f172a")
        hands.append(mh)

        hgrp = s3d.group(f"hands_{side}", *hands)
        s3d.at(hgrp, x=pos[0], y=pos[1], z=pos[2], rx=rot[0], ry=rot[1], rz=rot[2])
        parts.append(hgrp)

    # Steep dark slate roof pyramid + spire
    roof1 = s3d.extrude("roof_lower", s3d.rect(470, 470), 210, taper=32)
    s3d.at(roof1, z=1488)
    s3d.material(roof1, "painted_metal", color="#334155")
    parts.append(roof1)

    lantern = s3d.box("lantern", 210, 210, 130)
    s3d.at(lantern, z=1690)
    s3d.material(lantern, "brass", color="#eab308")
    parts.append(lantern)

    spire = s3d.cone("spire", 220, 340, d2=10)
    s3d.at(spire, z=1820)
    s3d.material(spire, "painted_metal", color="#1e293b")
    parts.append(spire)

    top_orb = s3d.sphere("top_orb", 46)
    s3d.at(top_orb, z=2148)
    s3d.material(top_orb, "brass", color="#facc15")
    parts.append(top_orb)

    return s3d.assembly("clock_tower", *parts)


def build_street_lamp():
    parts = []
    # Stone plinth + stepped iron base
    plinth = s3d.cylinder("plinth", 260, 70)
    s3d.material(plinth, "concrete", color="#64748b")
    parts.append(plinth)

    base = s3d.cone("base", 190, 180, d2=90)
    s3d.at(base, z=70)
    s3d.material(base, "painted_metal", color="#0f172a")
    parts.append(base)

    # Tall tapered iron pole
    pole = s3d.cone("pole", 82, 920, d2=52)
    s3d.at(pole, z=245)
    s3d.material(pole, "painted_metal", color="#1e293b")
    parts.append(pole)

    # Decorative brass collar rings
    for ci, cz in enumerate((250, 720, 1140)):
        ring = s3d.torus(f"ring_{ci}", 82 if ci == 0 else 68, 18)
        s3d.at(ring, z=cz)
        s3d.material(ring, "brass")
        parts.append(ring)

    # Classic Victorian cross-bar (ladder rest)
    crossbar = s3d.cylinder("crossbar", 26, 260)
    s3d.at(crossbar, x=-130, z=1040, ry=90)
    s3d.material(crossbar, "painted_metal", color="#0f172a")
    parts.append(crossbar)

    for side, sx in (("L", -135), ("R", 135)):
        ball = s3d.sphere(f"cb_ball_{side}", 42)
        s3d.at(ball, x=sx, z=1019)
        s3d.material(ball, "brass")
        parts.append(ball)

    # Lantern base cradle
    cradle = s3d.cone("cradle", 90, 75, d2=200)
    s3d.at(cradle, z=1155)
    s3d.material(cradle, "painted_metal", color="#0f172a")
    parts.append(cradle)

    # Warm glowing lantern core
    glow = s3d.cone("lantern_glow", 175, 225, d2=235)
    s3d.at(glow, z=1230)
    s3d.material(glow, "light", color="#fef08a", emission=3.5)
    parts.append(glow)

    # 4 dark iron lantern ribs around the glass
    for i in range(4):
        ang = math.radians(i * 90 + 45)
        rx, ry = math.cos(ang) * 102, math.sin(ang) * 102
        rib = s3d.box(f"lrib_{i}", 18, 18, 235)
        s3d.at(rib, x=rx, y=ry, z=1225)
        s3d.material(rib, "painted_metal", color="#0f172a")
        parts.append(rib)

    # Stepped lantern roof cap + finial
    cap = s3d.cone("lantern_cap", 285, 115, d2=52)
    s3d.at(cap, z=1450)
    s3d.material(cap, "painted_metal", color="#0f172a")
    parts.append(cap)

    finial = s3d.sphere("lantern_finial", 50)
    s3d.at(finial, z=1560)
    s3d.material(finial, "brass")
    parts.append(finial)

    return s3d.assembly("street_lamp", *parts)


MODELS = [
    # Station 1: Airport
    ("suitcase.glb", build_suitcase),
    ("passport.glb", build_passport),
    ("airplane.glb", build_airplane),
    ("departure_board.glb", build_departure_board),
    # Station 2: Train Station
    ("train.glb", build_train),
    ("ticket_machine.glb", build_ticket_machine),
    ("station_clock.glb", build_station_clock),
    ("bench.glb", build_bench),
    # Station 3: Cozy Cafe
    ("coffee_cup.glb", build_coffee_cup),
    ("cake_plate.glb", build_cake_plate),
    ("bistro_table.glb", build_bistro_table),
    ("menu_board.glb", build_menu_board),
    # Station 4: London Square
    ("phone_booth.glb", build_phone_booth),
    ("double_decker.glb", build_double_decker),
    ("clock_tower.glb", build_clock_tower),
    ("street_lamp.glb", build_street_lamp),
]


ALL_MODELS = MODELS + EXTRA_MODELS


def main():
    print(f"Building {len(ALL_MODELS)} 3D models with sand3d v{s3d.__version__} -> {OUT_DIR}")
    for filename, fn in ALL_MODELS:
        export_model(filename, fn)
    print(f"All {len(ALL_MODELS)} Sand3D models built successfully!")


if __name__ == "__main__":
    main()
