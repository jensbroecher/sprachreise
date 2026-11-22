"""Additional 24 Sand3D models (14 new interactive vocab props + 10 architectural scenery props).

Imported and exported by assets_src/build_assets.py.
"""

import math
import sand3d as s3d


# ==============================================================================
# NEW STATION 1 (AIRPORT) VOCAB & SCENERY
# ==============================================================================

def build_backpack():
    parts = []
    # Main rounded teal backpack body
    main = s3d.extrude("pack_main", s3d.rect(340, 175, r=52), 450)
    s3d.at(main, z=10)
    s3d.material(main, "fabric", color="#0d9488", roughness=0.75)
    parts.append(main)

    # Rounded top dome cap
    top_cap = s3d.extrude("pack_top", s3d.rect(315, 160, r=55), 55)
    s3d.at(top_cap, z=435)
    s3d.material(top_cap, "fabric", color="#0f766e", roughness=0.75)
    parts.append(top_cap)

    # Front orange pocket
    pocket = s3d.extrude("front_pocket", s3d.rect(250, 72, r=24), 210)
    s3d.at(pocket, y=-102, z=42)
    s3d.material(pocket, "fabric", color="#f97316", roughness=0.7)
    parts.append(pocket)

    # Zipper trim bars
    z1 = s3d.box("zip_front", 215, 12, 16)
    s3d.at(z1, y=-139, z=210)
    s3d.material(z1, "brass", color="#fbbf24")
    parts.append(z1)

    z2 = s3d.box("zip_top", 260, 14, 16)
    s3d.at(z2, y=-86, z=365)
    s3d.material(z2, "brass", color="#fbbf24")
    parts.append(z2)

    # Leather patch emblem on front
    patch = s3d.extrude("patch", s3d.rect(68, 12, r=4), 52)
    s3d.at(patch, y=-140, z=115)
    s3d.material(patch, "leather", color="#78350f")
    parts.append(patch)

    # Side bottle pockets
    for side, sx in (("L", -178), ("R", 178)):
        sp = s3d.extrude(f"side_p_{side}", s3d.rect(34, 110, r=12), 165)
        s3d.at(sp, x=sx, z=35)
        s3d.material(sp, "fabric", color="#115e59")
        parts.append(sp)

    # Back shoulder straps (+Y)
    for side, sx in (("L", -88), ("R", 88)):
        strap = s3d.extrude(f"strap_{side}", s3d.rect(54, 42, r=12), 370)
        s3d.at(strap, x=sx, y=98, z=45)
        s3d.material(strap, "leather", color="#92400e")
        parts.append(strap)

    # Top carry loop
    loop = s3d.torus("carry_loop", 76, 18)
    s3d.at(loop, y=15, z=515, rx=90)
    s3d.material(loop, "leather", color="#78350f")
    parts.append(loop)

    return s3d.assembly("backpack", *parts)


def build_camera():
    parts = []
    # Main silver retro camera body
    body = s3d.extrude("cam_body", s3d.rect(380, 155, r=28), 235)
    s3d.material(body, "aluminium", color="#e2e8f0")
    parts.append(body)

    # Dark leatherette wrap around middle
    grip_wrap = s3d.extrude("cam_wrap", s3d.rect(388, 162, r=28), 145)
    s3d.at(grip_wrap, z=35)
    s3d.material(grip_wrap, "leather", color="#1e293b")
    parts.append(grip_wrap)

    # Right-hand ergonomic grip bump
    grip = s3d.cylinder("cam_grip", 95, 225)
    s3d.at(grip, x=-145, y=-42, z=5)
    s3d.material(grip, "rubber", color="#0f172a")
    parts.append(grip)

    # Top pentaprism viewfinder hump
    prism = s3d.extrude("viewfinder", s3d.rect(145, 115, r=16), 72, taper=16)
    s3d.at(prism, z=232)
    s3d.material(prism, "aluminium", color="#cbd5e1")
    parts.append(prism)

    # Flash window on prism
    flash = s3d.box("flash", 74, 16, 36)
    s3d.at(flash, y=-54, z=250)
    s3d.material(flash, "light", color="#fef9c3", emission=1.6)
    parts.append(flash)

    # Shutter button (red) & mode dial (brass)
    shutter = s3d.cylinder("shutter", 44, 28)
    s3d.at(shutter, x=-135, y=-15, z=235)
    s3d.material(shutter, "glossy_plastic", color="#ef4444")
    parts.append(shutter)

    dial = s3d.cylinder("dial", 62, 26)
    s3d.at(dial, x=125, y=0, z=235)
    s3d.material(dial, "brass")
    parts.append(dial)

    # Protruding camera lens barrel (-Y)
    lens_outer = s3d.cylinder("lens_outer", 185, 135)
    s3d.at(lens_outer, y=-75, z=118, rx=90)
    s3d.material(lens_outer, "painted_metal", color="#1e293b")
    parts.append(lens_outer)

    lens_ring = s3d.torus("lens_ring", 186, 16)
    s3d.at(lens_ring, y=-160, z=118, rx=90)
    s3d.material(lens_ring, "brass", color="#f59e0b")
    parts.append(lens_ring)

    lens_glass = s3d.cylinder("lens_glass", 142, 148)
    s3d.at(lens_glass, y=-75, z=118, rx=90)
    s3d.material(lens_glass, "glossy_plastic", color="#0284c7", roughness=0.05)
    parts.append(lens_glass)

    lens_glint = s3d.sphere("lens_glint", 34)
    s3d.at(lens_glint, x=30, y=-215, z=132)
    s3d.material(lens_glint, "light", color="#bae6fd", emission=1.5)
    parts.append(lens_glint)

    return s3d.assembly("camera", *parts)


def build_control_tower():
    parts = []
    # Concrete base building
    base = s3d.extrude("atc_base", s3d.rect(520, 460, r=24), 220)
    s3d.material(base, "concrete", color="#e2e8f0")
    parts.append(base)

    # Tall tapered tower shaft
    shaft = s3d.cone("atc_shaft", 310, 920, d2=220)
    s3d.at(shaft, z=215)
    s3d.material(shaft, "concrete", color="#f1f5f9")
    parts.append(shaft)

    # Red/white aviation safety rings
    for i, rz in enumerate((480, 740)):
        band = s3d.cylinder(f"atc_band_{i}", 285 - i * 25, 72)
        s3d.at(band, z=rz)
        s3d.material(band, "glossy_plastic", color="#ef4444")
        parts.append(band)

    # Observation deck collar
    deck = s3d.cone("atc_deck", 240, 120, d2=460)
    s3d.at(deck, z=1110)
    s3d.material(deck, "painted_metal", color="#334155")
    parts.append(deck)

    # Angled glass ATC cab
    cab = s3d.cone("atc_cab", 430, 195, d2=500)
    s3d.at(cab, z=1230)
    s3d.material(cab, "glossy_plastic", color="#38bdf8", roughness=0.08)
    parts.append(cab)

    # Overhanging white roof disc
    roof = s3d.cylinder("atc_roof", 540, 48)
    s3d.at(roof, z=1420)
    s3d.material(roof, "glossy_plastic", color="#f8fafc")
    parts.append(roof)

    # Radar dome + antenna mast
    radome = s3d.sphere("radome", 145)
    s3d.at(radome, z=1462)
    s3d.material(radome, "glossy_plastic", color="#f8fafc")
    parts.append(radome)

    mast = s3d.cylinder("mast", 18, 220)
    s3d.at(mast, x=150, z=1460)
    s3d.material(mast, "steel")
    parts.append(mast)

    beacon = s3d.sphere("atc_beacon", 38)
    s3d.at(beacon, x=150, z=1672)
    s3d.material(beacon, "light", color="#ef4444", emission=3.0)
    parts.append(beacon)

    return s3d.assembly("control_tower", *parts)


def build_luggage_cart():
    parts = []
    # Base flatbed frame
    bed = s3d.extrude("cart_bed", s3d.rect(520, 320, r=24), 26)
    s3d.at(bed, z=68)
    s3d.material(bed, "painted_metal", color="#2563eb")
    parts.append(bed)

    # 4 wheels
    for idx, (wx, wy) in enumerate(((-190, -115), (190, -115), (-190, 115), (190, 115))):
        w = s3d.cylinder(f"cw_{idx}", 68, 28)
        s3d.at(w, x=wx, y=wy - 14, z=34, rx=90)
        s3d.material(w, "rubber", color="#1e293b")
        parts.append(w)

    # Chrome push-bar upright poles & cross handle
    for side, wy in (("L", -125), ("R", 125)):
        pole = s3d.cylinder(f"cpole_{side}", 24, 480)
        s3d.at(pole, x=-225, y=wy, z=85)
        s3d.material(pole, "chrome")
        parts.append(pole)

    hbar = s3d.cylinder("chbar", 28, 275)
    s3d.at(hbar, x=-225, y=137, z=565, rx=90)
    s3d.material(hbar, "rubber", color="#0f172a")
    parts.append(hbar)

    # Small red carry-on & yellow box stacked on trolley
    bag1 = s3d.extrude("cart_bag1", s3d.rect(240, 220, r=22), 145)
    s3d.at(bag1, x=45, z=94)
    s3d.material(bag1, "glossy_plastic", color="#f59e0b")
    parts.append(bag1)

    bag2 = s3d.extrude("cart_bag2", s3d.rect(185, 165, r=18), 115)
    s3d.at(bag2, x=40, z=239, rz=12)
    s3d.material(bag2, "glossy_plastic", color="#10b981")
    parts.append(bag2)

    return s3d.assembly("luggage_cart", *parts)


# ==============================================================================
# NEW STATION 2 (TRAIN STATION) VOCAB & SCENERY
# ==============================================================================

def build_map_stand():
    parts = []
    base = s3d.extrude("map_base", s3d.rect(480, 210, r=24), 42)
    s3d.material(base, "painted_metal", color="#1e293b")
    parts.append(base)

    for side, px in (("L", -175), ("R", 175)):
        post = s3d.cylinder(f"mpost_{side}", 34, 620)
        s3d.at(post, x=px, z=35)
        s3d.material(post, "brass")
        parts.append(post)

    # Navy display frame
    frame = s3d.extrude("map_frame", s3d.rect(480, 62, r=20), 420)
    s3d.at(frame, z=360)
    s3d.material(frame, "painted_metal", color="#1e3a8a")
    parts.append(frame)

    # White map paper backing
    paper = s3d.box("map_paper", 425, 70, 355)
    s3d.at(paper, z=392)
    s3d.material(paper, "plastic", color="#fffbeb", roughness=0.6)
    parts.append(paper)

    # Colorful London Tube transit lines on front (-Y)!
    line_red = s3d.box("line_red", 340, 10, 22)
    s3d.at(line_red, y=-38, z=615, ry=10)
    s3d.material(line_red, "plastic", color="#dc2626")
    parts.append(line_red)

    line_blue = s3d.box("line_blue", 310, 10, 22)
    s3d.at(line_blue, y=-38, z=535, ry=-18)
    s3d.material(line_blue, "plastic", color="#2563eb")
    parts.append(line_blue)

    line_green = s3d.box("line_green", 290, 10, 22)
    s3d.at(line_green, x=20, y=-38, z=470, ry=6)
    s3d.material(line_green, "plastic", color="#16a34a")
    parts.append(line_green)

    # Station interchange dots
    for idx, (dx, dz) in enumerate(((-105, 600), (15, 560), (110, 495), (-70, 480))):
        dot = s3d.cylinder(f"st_dot_{idx}", 34, 14)
        s3d.at(dot, x=dx, y=-36, z=dz, rx=90)
        s3d.material(dot, "plastic", color="#f59e0b")
        parts.append(dot)

    return s3d.assembly("map_stand", *parts)


def build_umbrella():
    parts = []
    # Small neat brass stand base
    stand = s3d.cylinder("umb_base", 240, 36)
    s3d.material(stand, "brass", color="#b45309")
    parts.append(stand)

    # Central wooden shaft
    shaft = s3d.cylinder("umb_shaft", 24, 590)
    s3d.at(shaft, z=30)
    s3d.material(shaft, "walnut")
    parts.append(shaft)

    # Classic curved J-handle at bottom (actually let's make it an open upright umbrella with handle!)
    handle = s3d.torus("umb_handle", 90, 24)
    s3d.at(handle, x=45, z=105, rx=90)
    s3d.material(handle, "walnut")
    parts.append(handle)

    # Open domed cheerful yellow & navy umbrella canopy!
    canopy = s3d.dome("canopy_main", 520, 165)
    s3d.at(canopy, z=435)
    s3d.material(canopy, "fabric", color="#facc15", roughness=0.45)
    parts.append(canopy)

    # Decorative navy trim rim around canopy edge
    rim = s3d.torus("canopy_rim", 520, 22)
    s3d.at(rim, z=435)
    s3d.material(rim, "fabric", color="#1e3a8a")
    parts.append(rim)

    # Brass top ferrule spike
    tip = s3d.cone("umb_tip", 36, 75, d2=8)
    s3d.at(tip, z=595)
    s3d.material(tip, "brass")
    parts.append(tip)

    return s3d.assembly("umbrella", *parts)


def build_railway_signal():
    parts = []
    base = s3d.box("sig_base", 220, 220, 65)
    s3d.material(base, "concrete", color="#475569")
    parts.append(base)

    pole = s3d.cylinder("sig_pole", 56, 860)
    s3d.at(pole, z=60)
    s3d.material(pole, "painted_metal", color="#334155")
    parts.append(pole)

    head = s3d.extrude("sig_head", s3d.rect(165, 115, r=32), 340)
    s3d.at(head, z=640)
    s3d.material(head, "painted_metal", color="#0f172a")
    parts.append(head)

    # Red (top) and glowing green (bottom) signal lamps
    red_l = s3d.cylinder("sig_red", 76, 28)
    s3d.at(red_l, y=-54, z=875, rx=90)
    s3d.material(red_l, "glossy_plastic", color="#7f1d1d")
    parts.append(red_l)

    green_l = s3d.cylinder("sig_green", 76, 28)
    s3d.at(green_l, y=-54, z=740, rx=90)
    s3d.material(green_l, "light", color="#22c55e", emission=3.2)
    parts.append(green_l)

    return s3d.assembly("railway_signal", *parts)


def build_platform_canopy():
    parts = []
    # Two Victorian iron pillars
    for side, px in (("L", -560), ("R", 560)):
        foot = s3d.cylinder(f"pc_foot_{side}", 120, 65)
        s3d.at(foot, x=px)
        s3d.material(foot, "painted_metal", color="#1e293b")
        parts.append(foot)

        col = s3d.cylinder(f"pc_col_{side}", 62, 680)
        s3d.at(col, x=px, z=60)
        s3d.material(col, "painted_metal", color="#1e293b")
        parts.append(col)

    # Sloped crimson & glass canopy roof
    beam = s3d.box("pc_beam", 1280, 120, 56)
    s3d.at(beam, z=720)
    s3d.material(beam, "painted_metal", color="#991b1b")
    parts.append(beam)

    roof = s3d.extrude("pc_roof", s3d.rect(1340, 440, r=20), 42)
    s3d.at(roof, z=770, rx=-8)
    s3d.material(roof, "glossy_plastic", color="#dc2626", roughness=0.3)
    parts.append(roof)

    skylight = s3d.extrude("pc_sky", s3d.rect(1080, 250, r=12), 52)
    s3d.at(skylight, z=776, rx=-8)
    s3d.material(skylight, "glossy_plastic", color="#bae6fd", roughness=0.1)
    parts.append(skylight)

    return s3d.assembly("platform_canopy", *parts)


# ==============================================================================
# NEW STATION 3: BOUTIQUE HOTEL (6 VOCAB + 2 SCENERY)
# ==============================================================================

def build_hotel_bed():
    parts = []
    # 4 oak corner legs
    for idx, (lx, ly) in enumerate(((-330, -420), (330, -420), (-330, 420), (330, 420))):
        leg = s3d.cylinder(f"bleg_{idx}", 52, 130)
        s3d.at(leg, x=lx, y=ly)
        s3d.material(leg, "walnut")
        parts.append(leg)

    # Wooden bed frame base
    frame = s3d.extrude("bed_frame", s3d.rect(740, 920, r=24), 105)
    s3d.at(frame, z=105)
    s3d.material(frame, "oak", color="#92400e")
    parts.append(frame)

    # Plush headboard (+Y)
    headboard = s3d.extrude("headboard", s3d.rect(760, 72, r=24), 440)
    s3d.at(headboard, y=435, z=120)
    s3d.material(headboard, "velvet", color="#1e3a8a")
    parts.append(headboard)

    # Crisp white mattress
    mattress = s3d.extrude("mattress", s3d.rect(690, 855, r=36), 135)
    s3d.at(mattress, y=-10, z=205)
    s3d.material(mattress, "fabric", color="#f8fafc", roughness=0.8)
    parts.append(mattress)

    # Teal hotel duvet blanket covering lower 2/3
    duvet = s3d.extrude("duvet", s3d.rect(710, 560, r=42), 145)
    s3d.at(duvet, y=-160, z=215)
    s3d.material(duvet, "fabric", color="#0d9488", roughness=0.82)
    parts.append(duvet)

    # Gold decorative runner across foot of bed
    runner = s3d.extrude("runner", s3d.rect(722, 145, r=18), 152)
    s3d.at(runner, y=-315, z=218)
    s3d.material(runner, "fabric", color="#f59e0b")
    parts.append(runner)

    # Two fluffy cream pillows
    for side, px in (("L", -175), ("R", 175)):
        pil = s3d.extrude(f"pillow_{side}", s3d.rect(285, 175, r=48), 88)
        s3d.at(pil, x=px, y=275, z=330, rx=14)
        s3d.material(pil, "fabric", color="#fffbeb", roughness=0.85)
        parts.append(pil)

    return s3d.assembly("hotel_bed", *parts)


def build_room_key():
    parts = []
    # Little velvet display cushion tray
    tray = s3d.extrude("key_tray", s3d.rect(420, 260, r=32), 45)
    s3d.material(tray, "walnut")
    parts.append(tray)

    pad = s3d.extrude("key_pad", s3d.rect(360, 200, r=24), 18)
    s3d.at(pad, z=42)
    s3d.material(pad, "velvet", color="#991b1b")
    parts.append(pad)

    # Oversized ornate brass hotel key resting angled on tray
    key_parts = []
    bow = s3d.torus("key_bow", 115, 24)
    s3d.at(bow, x=-105, z=12)
    s3d.material(bow, "brass", color="#facc15")
    key_parts.append(bow)

    shaft = s3d.cylinder("key_shaft", 24, 240)
    s3d.at(shaft, x=-50, z=24, ry=90)
    s3d.material(shaft, "brass", color="#facc15")
    key_parts.append(shaft)

    for ti, (tx, tw, th) in enumerate(((125, 22, 58), (160, 22, 42), (185, 22, 66))):
        tooth = s3d.box(f"tooth_{ti}", tw, th, 20)
        s3d.at(tooth, x=tx, y=-th / 2, z=14)
        s3d.material(tooth, "brass", color="#eab308")
        key_parts.append(tooth)

    # Burgundy numbered hotel fob attached to bow
    fob = s3d.extrude("key_fob", s3d.rect(135, 76, r=34), 22)
    s3d.at(fob, x=-215, y=35, z=12, rz=-22)
    s3d.material(fob, "glossy_plastic", color="#7c3aed")
    key_parts.append(fob)

    kgrp = s3d.group("key_grp", *key_parts)
    s3d.at(kgrp, x=35, y=0, z=66, rz=12)
    parts.append(kgrp)

    return s3d.assembly("room_key", *parts)


def build_reception_bell():
    parts = []
    # Mahogany counter stand base
    pad = s3d.cylinder("bell_pad", 330, 42)
    s3d.material(pad, "walnut")
    parts.append(pad)

    # Black rim base
    rim = s3d.cylinder("bell_rim", 275, 34)
    s3d.at(rim, z=42)
    s3d.material(rim, "painted_metal", color="#1e293b")
    parts.append(rim)

    # Gleaming brass dome bell
    dome = s3d.dome("bell_dome", 250, 145)
    s3d.at(dome, z=72)
    s3d.material(dome, "brass", color="#fbbf24")
    parts.append(dome)

    # Top plunger button
    stem = s3d.cylinder("bell_stem", 30, 32)
    s3d.at(stem, z=210)
    s3d.material(stem, "chrome")
    parts.append(stem)

    btn = s3d.cylinder("bell_btn", 64, 22)
    s3d.at(btn, z=238)
    s3d.material(btn, "chrome")
    parts.append(btn)

    return s3d.assembly("reception_bell", *parts)


def build_armchair():
    parts = []
    # 4 oak legs
    for idx, (lx, ly) in enumerate(((-180, -165), (180, -165), (-180, 165), (180, 165))):
        leg = s3d.cone(f"aleg_{idx}", 48, 125, d2=32)
        s3d.at(leg, x=lx, y=ly)
        s3d.material(leg, "walnut")
        parts.append(leg)

    # Deep emerald velvet seat cushion
    seat = s3d.extrude("arm_seat", s3d.rect(440, 420, r=42), 145)
    s3d.at(seat, z=120)
    s3d.material(seat, "velvet", color="#059669")
    parts.append(seat)

    # High cozy backrest (+Y)
    back = s3d.extrude("arm_back", s3d.rect(440, 125, r=42), 410)
    s3d.at(back, y=155, z=210)
    s3d.material(back, "velvet", color="#047857")
    parts.append(back)

    # Rolled armrests
    for side, sx in (("L", -210), ("R", 210)):
        arm = s3d.extrude(f"arm_{side}", s3d.rect(105, 420, r=36), 210)
        s3d.at(arm, x=sx, z=160)
        s3d.material(arm, "velvet", color="#059669")
        parts.append(arm)

    # Bright gold accent throw pillow
    cushion = s3d.extrude("throw_pillow", s3d.rect(210, 88, r=28), 185)
    s3d.at(cushion, y=55, z=265, rx=-15)
    s3d.material(cushion, "fabric", color="#fbbf24")
    parts.append(cushion)

    return s3d.assembly("armchair", *parts)


def build_desk_lamp():
    parts = []
    # Nightstand wooden cube underneath
    stand = s3d.extrude("nightstand", s3d.rect(340, 320, r=20), 340)
    s3d.material(stand, "oak", color="#b45309")
    parts.append(stand)

    drawer = s3d.extrude("drawer", s3d.rect(280, 22, r=8), 110)
    s3d.at(drawer, y=-158, z=190)
    s3d.material(drawer, "oak", color="#92400e")
    parts.append(drawer)

    knob = s3d.sphere("knob", 32)
    s3d.at(knob, y=-182, z=230)
    s3d.material(knob, "brass")
    parts.append(knob)

    # Brass lamp base + stem
    lbase = s3d.cylinder("lamp_base", 165, 32)
    s3d.at(lbase, z=340)
    s3d.material(lbase, "brass", color="#d97706")
    parts.append(lbase)

    stem = s3d.cylinder("lamp_stem", 34, 210)
    s3d.at(stem, z=368)
    s3d.material(stem, "brass", color="#eab308")
    parts.append(stem)

    # Glowing warm cream lampshade
    shade = s3d.cone("lamp_shade", 255, 195, d2=155)
    s3d.at(shade, z=515)
    s3d.material(shade, "light", color="#fef3c7", emission=1.9)
    parts.append(shade)

    top_rim = s3d.torus("shade_rim", 156, 14)
    s3d.at(top_rim, z=706)
    s3d.material(top_rim, "brass")
    parts.append(top_rim)

    return s3d.assembly("desk_lamp", *parts)


def build_window_frame():
    parts = []
    # Cream wall section & window sill
    sill = s3d.extrude("win_sill", s3d.rect(580, 165, r=14), 48)
    s3d.at(sill, z=120)
    s3d.material(sill, "oak", color="#d6b48c")
    parts.append(sill)

    # White window outer casing
    for side, wx in (("L", -240), ("R", 240)):
        jamb = s3d.box(f"jamb_{side}", 56, 95, 580)
        s3d.at(jamb, x=wx, z=160)
        s3d.material(jamb, "plastic", color="#f8fafc")
        parts.append(jamb)

    top_bar = s3d.box("win_top", 540, 105, 58)
    s3d.at(top_bar, z=710)
    s3d.material(top_bar, "plastic", color="#f8fafc")
    parts.append(top_bar)

    # Sunny sky-blue glass pane
    glass = s3d.box("win_glass", 430, 32, 545)
    s3d.at(glass, z=168)
    s3d.material(glass, "light", color="#7dd3fc", emission=1.1)
    parts.append(glass)

    # Cross mullions
    mv = s3d.box("mull_v", 24, 52, 545)
    s3d.at(mv, z=168)
    s3d.material(mv, "plastic", color="#ffffff")
    parts.append(mv)

    mh = s3d.box("mull_h", 435, 52, 24)
    s3d.at(mh, z=435)
    s3d.material(mh, "plastic", color="#ffffff")
    parts.append(mh)

    # Cute teal curtains framing both sides
    for side, cx in (("L", -235), ("R", 235)):
        curt = s3d.extrude(f"curtain_{side}", s3d.rect(86, 118, r=24), 600)
        s3d.at(curt, x=cx, y=-20, z=155)
        s3d.material(curt, "velvet", color="#0f766e")
        parts.append(curt)

    # Terracotta flower box with blooms on sill!
    fbox = s3d.extrude("flower_box", s3d.rect(360, 95, r=12), 85)
    s3d.at(fbox, y=-58, z=168)
    s3d.material(fbox, "ceramic", color="#c2410c")
    parts.append(fbox)

    for fi, (fx, col) in enumerate(((-110, "#f43f5e"), (0, "#facc15"), (110, "#ec4899"))):
        bush = s3d.sphere(f"fbush_{fi}", 86)
        s3d.at(bush, x=fx, y=-58, z=235)
        s3d.material(bush, "plastic", color="#16a34a")
        parts.append(bush)

        bloom = s3d.sphere(f"bloom_{fi}", 44)
        s3d.at(bloom, x=fx, y=-74, z=288)
        s3d.material(bloom, "plastic", color=col)
        parts.append(bloom)

    return s3d.assembly("window_frame", *parts)


def build_reception_desk():
    parts = []
    # Main L-shaped wood desk body
    body = s3d.extrude("rec_body", s3d.rect(920, 340, r=24), 460)
    s3d.material(body, "walnut", color="#5c3a21")
    parts.append(body)

    # Vertical gold decorative slats on front (-Y)
    for idx in range(-3, 4):
        slat = s3d.box(f"rslat_{idx}", 22, 16, 360)
        s3d.at(slat, x=idx * 115, y=-172, z=50)
        s3d.material(slat, "brass", color="#d97706")
        parts.append(slat)

    # White marble countertop
    top = s3d.extrude("rec_top", s3d.rect(980, 400, r=28), 44)
    s3d.at(top, z=460)
    s3d.material(top, "marble", color="#fafaf9")
    parts.append(top)

    # Guestbook + golden desk sign
    book = s3d.extrude("guestbook", s3d.rect(195, 145, r=8), 26)
    s3d.at(book, x=-190, z=504, rz=8)
    s3d.material(book, "leather", color="#7f1d1d")
    parts.append(book)

    sign = s3d.extrude("rec_sign", s3d.rect(220, 48, r=8), 88)
    s3d.at(sign, x=210, z=504)
    s3d.material(sign, "brass", color="#f59e0b")
    parts.append(sign)

    return s3d.assembly("reception_desk", *parts)


def build_hotel_sign():
    parts = []
    base = s3d.cylinder("hs_base", 240, 55)
    s3d.material(base, "marble", color="#e2e8f0")
    parts.append(base)

    pole = s3d.cylinder("hs_pole", 58, 720)
    s3d.at(pole, z=50)
    s3d.material(pole, "brass", color="#d97706")
    parts.append(pole)

    plaque = s3d.extrude("hs_plaque", s3d.rect(420, 72, r=24), 210)
    s3d.at(plaque, z=680)
    s3d.material(plaque, "painted_metal", color="#1e3a8a")
    parts.append(plaque)

    glow = s3d.box("hs_glow", 355, 82, 130)
    s3d.at(glow, z=720)
    s3d.material(glow, "light", color="#fef08a", emission=1.8)
    parts.append(glow)

    star = s3d.sphere("hs_star", 75)
    s3d.at(star, z=890)
    s3d.material(star, "brass", color="#facc15")
    parts.append(star)

    return s3d.assembly("hotel_sign", *parts)


# ==============================================================================
# NEW STATION 4 (COZY CAFE) VOCAB & SCENERY
# ==============================================================================

def build_teapot():
    parts = []
    # Foot ring
    foot = s3d.cylinder("tp_foot", 160, 26)
    s3d.material(foot, "ceramic", color="#0284c7")
    parts.append(foot)

    # Plump ceramic sky-blue teapot body
    pot = s3d.sphere("tp_body", 275)
    s3d.at(pot, z=18)
    s3d.material(pot, "ceramic", color="#38bdf8")
    parts.append(pot)

    # Decorative white belt stripe
    belt = s3d.torus("tp_belt", 272, 22)
    s3d.at(belt, z=155)
    s3d.material(belt, "ceramic", color="#ffffff")
    parts.append(belt)

    # Lid + golden knob
    lid = s3d.dome("tp_lid", 145, 58)
    s3d.at(lid, z=272)
    s3d.material(lid, "ceramic", color="#0284c7")
    parts.append(lid)

    knob = s3d.sphere("tp_knob", 48)
    s3d.at(knob, z=322)
    s3d.material(knob, "brass", color="#fbbf24")
    parts.append(knob)

    # Spout (-X)
    spout = s3d.cone("tp_spout", 76, 175, d2=36)
    s3d.at(spout, x=-110, z=140, ry=-52)
    s3d.material(spout, "ceramic", color="#38bdf8")
    parts.append(spout)

    # Curved handle (+X)
    handle = s3d.torus("tp_handle", 140, 28)
    s3d.at(handle, x=132, z=160, rx=90)
    s3d.material(handle, "ceramic", color="#0284c7")
    parts.append(handle)

    return s3d.assembly("teapot", *parts)


def build_water_bottle():
    parts = []
    # Wooden coaster tray
    coaster = s3d.extrude("w_coaster", s3d.rect(340, 220, r=28), 22)
    s3d.material(coaster, "oak")
    parts.append(coaster)

    # Sparkling blue glass bottle (left)
    b_body = s3d.cylinder("w_body", 125, 220)
    s3d.at(b_body, x=-65, z=22)
    s3d.material(b_body, "glossy_plastic", color="#38bdf8", roughness=0.08)
    parts.append(b_body)

    b_shoulder = s3d.cone("w_shoulder", 125, 78, d2=48)
    s3d.at(b_shoulder, x=-65, z=242)
    s3d.material(b_shoulder, "glossy_plastic", color="#38bdf8", roughness=0.08)
    parts.append(b_shoulder)

    b_neck = s3d.cylinder("w_neck", 48, 75)
    s3d.at(b_neck, x=-65, z=318)
    s3d.material(b_neck, "glossy_plastic", color="#7dd3fc", roughness=0.08)
    parts.append(b_neck)

    b_cap = s3d.cylinder("w_cap", 54, 34)
    s3d.at(b_cap, x=-65, z=390)
    s3d.material(b_cap, "plastic", color="#1d4ed8")
    parts.append(b_cap)

    # White bottle label
    label = s3d.cylinder("w_label", 130, 82)
    s3d.at(label, x=-65, z=105)
    s3d.material(label, "plastic", color="#f8fafc")
    parts.append(label)

    # Tumbler glass filled with water (right)
    glass = s3d.cone("w_glass", 82, 138, d2=102)
    s3d.at(glass, x=85, z=22)
    s3d.material(glass, "glossy_plastic", color="#bae6fd", roughness=0.06)
    parts.append(glass)

    lemon = s3d.cylinder("w_lemon", 54, 16)
    s3d.at(lemon, x=115, z=148, ry=35)
    s3d.material(lemon, "plastic", color="#facc15")
    parts.append(lemon)

    return s3d.assembly("water_bottle", *parts)


def build_espresso_counter():
    parts = []
    # Main wooden café bar counter
    counter = s3d.extrude("bar_base", s3d.rect(980, 380, r=24), 450)
    s3d.material(counter, "oak", color="#78350f")
    parts.append(counter)

    top = s3d.extrude("bar_top", s3d.rect(1030, 430, r=28), 42)
    s3d.at(top, z=450)
    s3d.material(top, "marble", color="#fffbeb")
    parts.append(top)

    # Shiny red & chrome Italian espresso machine on left
    esp = s3d.extrude("esp_body", s3d.rect(310, 230, r=22), 265)
    s3d.at(esp, x=-245, z=492)
    s3d.material(esp, "glossy_plastic", color="#dc2626", roughness=0.18)
    parts.append(esp)

    esp_chrome = s3d.box("esp_front", 270, 36, 120)
    s3d.at(esp_chrome, x=-245, y=-115, z=595)
    s3d.material(esp_chrome, "chrome")
    parts.append(esp_chrome)

    # Glass pastry dome display on right
    p_base = s3d.cylinder("p_base", 240, 26)
    s3d.at(p_base, x=235, z=492)
    s3d.material(p_base, "brass")
    parts.append(p_base)

    p_dome = s3d.dome("p_dome", 225, 155)
    s3d.at(p_dome, x=235, z=515)
    s3d.material(p_dome, "glossy_plastic", color="#e0f2fe", roughness=0.06, opacity=0.72)
    parts.append(p_dome)

    # Awning posts & striped mint/cream café awning overhead!
    for side, px in (("L", -460), ("R", 460)):
        ap = s3d.cylinder(f"aw_post_{side}", 36, 620)
        s3d.at(ap, x=px, y=145, z=470)
        s3d.material(ap, "painted_metal", color="#1e293b")
        parts.append(ap)

    for si in range(7):
        sx = -420 + si * 140
        col = "#10b981" if si % 2 == 0 else "#fffbeb"
        stripe = s3d.extrude(f"aw_s_{si}", s3d.rect(140, 440, r=8), 46)
        s3d.at(stripe, x=sx, y=-15, z=1060, rx=18)
        s3d.material(stripe, "fabric", color=col)
        parts.append(stripe)

    return s3d.assembly("espresso_counter", *parts)


def build_cafe_plant():
    parts = []
    pot = s3d.cone("cp_pot", 180, 220, d2=265)
    s3d.material(pot, "ceramic", color="#c2410c")
    parts.append(pot)

    rim = s3d.torus("cp_rim", 265, 32)
    s3d.at(rim, z=212)
    s3d.material(rim, "ceramic", color="#ea580c")
    parts.append(rim)

    stem = s3d.cylinder("cp_stem", 48, 360)
    s3d.at(stem, z=180)
    s3d.material(stem, "walnut")
    parts.append(stem)

    b1 = s3d.sphere("cp_b1", 280)
    s3d.at(b1, z=320)
    s3d.material(b1, "plastic", color="#16a34a", roughness=0.8)
    parts.append(b1)

    b2 = s3d.sphere("cp_b2", 195)
    s3d.at(b2, z=540)
    s3d.material(b2, "plastic", color="#22c55e", roughness=0.8)
    parts.append(b2)

    return s3d.assembly("cafe_plant", *parts)


# ==============================================================================
# NEW STATION 5 (LONDON SQUARE) VOCAB & SCENERY
# ==============================================================================

def build_post_box():
    parts = []
    # Iconic British Royal Mail Pillar Box!
    plinth = s3d.cylinder("pb_plinth", 295, 95)
    s3d.material(plinth, "painted_metal", color="#0f172a")
    parts.append(plinth)

    body = s3d.cylinder("pb_body", 260, 560)
    s3d.at(body, z=95)
    s3d.material(body, "glossy_plastic", color="#dc2626", roughness=0.22)
    parts.append(body)

    # Mail aperture slot (-Y)
    slot_frame = s3d.extrude("pb_slot_f", s3d.rect(145, 38, r=10), 62)
    s3d.at(slot_frame, y=-124, z=515)
    s3d.material(slot_frame, "glossy_plastic", color="#991b1b")
    parts.append(slot_frame)

    slot_hole = s3d.box("pb_slot_h", 112, 46, 26)
    s3d.at(slot_hole, y=-126, z=532)
    s3d.material(slot_hole, "rubber", color="#0f172a")
    parts.append(slot_hole)

    # White collection timetable plaque
    plaque = s3d.box("pb_plaque", 95, 16, 125)
    s3d.at(plaque, y=-130, z=315)
    s3d.material(plaque, "plastic", color="#f8fafc")
    parts.append(plaque)

    # Flared cornice & signature rounded domed cap
    cap_rim = s3d.cylinder("pb_rim", 310, 42)
    s3d.at(cap_rim, z=648)
    s3d.material(cap_rim, "glossy_plastic", color="#dc2626", roughness=0.22)
    parts.append(cap_rim)

    cap_dome = s3d.dome("pb_dome", 295, 115)
    s3d.at(cap_dome, z=686)
    s3d.material(cap_dome, "glossy_plastic", color="#dc2626", roughness=0.22)
    parts.append(cap_dome)

    return s3d.assembly("post_box", *parts)


def build_bicycle():
    parts = []
    # Two spoked wheels along X (front at -X, back at +X)
    for side, wx in (("F", -255), ("B", 255)):
        tire = s3d.torus(f"tire_{side}", 240, 32)
        s3d.at(tire, x=wx, z=136, rx=90)
        s3d.material(tire, "rubber", color="#1e293b")
        parts.append(tire)

        rim = s3d.torus(f"wrim_{side}", 206, 14)
        s3d.at(rim, x=wx, z=136, rx=90)
        s3d.material(rim, "chrome")
        parts.append(rim)

        hub = s3d.cylinder(f"whub_{side}", 38, 42)
        s3d.at(hub, x=wx, y=21, z=136, rx=90)
        s3d.material(hub, "chrome")
        parts.append(hub)

        # Cross spokes
        for ang in (0, 60, 120):
            sp = s3d.cylinder(f"sp_{side}_{ang}", 10, 200)
            s3d.at(sp, x=wx, z=136, ry=ang)
            s3d.material(sp, "steel")
            parts.append(sp)

    # Mint-green city bicycle diamond frame
    top_tube = s3d.cylinder("top_tube", 24, 315)
    s3d.at(top_tube, x=-185, z=325, ry=94)
    s3d.material(top_tube, "glossy_plastic", color="#10b981")
    parts.append(top_tube)

    down_tube = s3d.cylinder("down_tube", 24, 285)
    s3d.at(down_tube, x=-195, z=315, ry=132)
    s3d.material(down_tube, "glossy_plastic", color="#10b981")
    parts.append(down_tube)

    seat_tube = s3d.cylinder("seat_tube", 26, 265)
    s3d.at(seat_tube, x=60, z=135, ry=14)
    s3d.material(seat_tube, "glossy_plastic", color="#10b981")
    parts.append(seat_tube)

    rear_stay = s3d.cylinder("rear_stay", 20, 240)
    s3d.at(rear_stay, x=115, z=310, ry=142)
    s3d.material(rear_stay, "glossy_plastic", color="#10b981")
    parts.append(rear_stay)

    chain_stay = s3d.cylinder("chain_stay", 20, 230)
    s3d.at(chain_stay, x=35, z=135, ry=90)
    s3d.material(chain_stay, "glossy_plastic", color="#10b981")
    parts.append(chain_stay)

    # Front fork & handlebars
    fork = s3d.cylinder("front_fork", 26, 305)
    s3d.at(fork, x=-245, z=135, ry=14)
    s3d.material(fork, "glossy_plastic", color="#10b981")
    parts.append(fork)

    hbar = s3d.cylinder("handlebars", 24, 230)
    s3d.at(hbar, x=-180, y=115, z=435, rx=90)
    s3d.material(hbar, "chrome")
    parts.append(hbar)

    for side, gy in (("L", -115), ("R", 115)):
        grip = s3d.cylinder(f"bgrip_{side}", 34, 62)
        s3d.at(grip, x=-180, y=gy + (31 if side == "L" else -31), z=435, rx=90)
        s3d.material(grip, "leather", color="#78350f")
        parts.append(grip)

    # Brown leather saddle
    saddle = s3d.extrude("saddle", s3d.rect(145, 78, r=28), 32)
    s3d.at(saddle, x=122, z=395)
    s3d.material(saddle, "leather", color="#78350f")
    parts.append(saddle)

    # Cute wicker front basket!
    basket = s3d.extrude("basket", s3d.rect(125, 165, r=18), 115)
    s3d.at(basket, x=-255, z=310)
    s3d.material(basket, "oak", color="#d97706")
    parts.append(basket)

    return s3d.assembly("bicycle", *parts)


def build_park_fountain():
    parts = []
    # Wide stone basin rim
    basin_wall = s3d.tube("f_wall", 680, 560, 135)
    s3d.material(basin_wall, "concrete", color="#e2e8f0")
    parts.append(basin_wall)

    basin_floor = s3d.cylinder("f_floor", 660, 38)
    s3d.material(basin_floor, "concrete", color="#cbd5e1")
    parts.append(basin_floor)

    # Sparkling blue water pool
    water = s3d.cylinder("f_water", 580, 92)
    s3d.at(water, z=25)
    s3d.material(water, "glossy_plastic", color="#38bdf8", roughness=0.06)
    parts.append(water)

    # Central carved pedestal & upper bowl
    ped = s3d.cone("f_ped", 170, 290, d2=95)
    s3d.at(ped, z=35)
    s3d.material(ped, "concrete", color="#f1f5f9")
    parts.append(ped)

    bowl = s3d.cone("f_bowl", 120, 95, d2=320)
    s3d.at(bowl, z=290)
    s3d.material(bowl, "concrete", color="#e2e8f0")
    parts.append(bowl)

    upper_water = s3d.cylinder("f_uwater", 265, 22)
    s3d.at(upper_water, z=372)
    s3d.material(upper_water, "glossy_plastic", color="#7dd3fc", roughness=0.05)
    parts.append(upper_water)

    # Water jet finial plume
    plume = s3d.cone("f_plume", 42, 165, d2=98)
    s3d.at(plume, z=385)
    s3d.material(plume, "light", color="#bae6fd", emission=1.1)
    parts.append(plume)

    return s3d.assembly("park_fountain", *parts)


def build_park_tree():
    parts = []
    # Tapered oak trunk
    trunk = s3d.cone("tr_trunk", 155, 420, d2=85)
    s3d.material(trunk, "walnut", color="#78350f")
    parts.append(trunk)

    # Lush multi-layered green foliage puffs
    puffs = [
        (0, 0, 355, 340, "#15803d"),
        (-135, 65, 315, 240, "#16a34a"),
        (140, -55, 325, 250, "#16a34a"),
        (25, 115, 385, 235, "#22c55e"),
        (-35, -105, 375, 230, "#15803d"),
        (0, 0, 515, 245, "#22c55e"),
    ]
    for idx, (px, py, pz, d, col) in enumerate(puffs):
        p = s3d.sphere(f"tr_leaf_{idx}", d)
        s3d.at(p, x=px, y=py, z=pz)
        s3d.material(p, "plastic", color=col, roughness=0.82)
        parts.append(p)

    return s3d.assembly("park_tree", *parts)


EXTRA_MODELS = [
    # Station 1 Airport extra vocab + scenery
    ("backpack.glb", build_backpack),
    ("camera.glb", build_camera),
    ("control_tower.glb", build_control_tower),
    ("luggage_cart.glb", build_luggage_cart),
    # Station 2 Train Station extra vocab + scenery
    ("map_stand.glb", build_map_stand),
    ("umbrella.glb", build_umbrella),
    ("railway_signal.glb", build_railway_signal),
    ("platform_canopy.glb", build_platform_canopy),
    # Station 3 Boutique Hotel vocab + scenery
    ("hotel_bed.glb", build_hotel_bed),
    ("room_key.glb", build_room_key),
    ("reception_bell.glb", build_reception_bell),
    ("armchair.glb", build_armchair),
    ("desk_lamp.glb", build_desk_lamp),
    ("window_frame.glb", build_window_frame),
    ("reception_desk.glb", build_reception_desk),
    ("hotel_sign.glb", build_hotel_sign),
    # Station 4 Cozy Cafe extra vocab + scenery
    ("teapot.glb", build_teapot),
    ("water_bottle.glb", build_water_bottle),
    ("espresso_counter.glb", build_espresso_counter),
    ("cafe_plant.glb", build_cafe_plant),
    # Station 5 London Square extra vocab + scenery
    ("post_box.glb", build_post_box),
    ("bicycle.glb", build_bicycle),
    ("park_fountain.glb", build_park_fountain),
    ("park_tree.glb", build_park_tree),
]
