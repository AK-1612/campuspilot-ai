#!/usr/bin/env python3
"""
CampusPilot AI — Compact Source Code PDF (Core Files Only)
"""

import os, datetime
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_RIGHT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.pdfgen import canvas

NAVY       = colors.HexColor("#002f5c")
TEAL_LIGHT = colors.HexColor("#60f8cb")
GREY_MID   = colors.HexColor("#475569")
GREY_LIGHT = colors.HexColor("#f1f5f9")
GREY_RULE  = colors.HexColor("#e2e8f0")
CODE_BG    = colors.HexColor("#0f172a")
WHITE      = colors.white

PAGE_W, PAGE_H = A4
MARGIN  = 18 * mm
INNER_W = PAGE_W - 2 * MARGIN

REPO_URL = "https://github.com/AK-1612/campuspilot-ai"
DATE_STR = datetime.date.today().strftime("%B %d, %Y")

# Core files only
CORE_FILES = [
    ("Agent & Intelligence", [
        "backend/agent/agent.py",
        "backend/agent/intent_classifier.py",
        "backend/agent/tools.py",
        "backend/agent/memory.py",
        "backend/agent/profile_handler.py",
        "backend/agent/fallbacks.py",
    ]),
    ("API & Routing", [
        "backend/main.py",
        "backend/routers/navigate.py",
        "backend/routers/qr.py",
        "backend/routers/alert.py",
        "backend/config.py",
    ]),
    ("Database", [
        "db/schema.cypher",
        "db/seed.cypher",
    ]),
    ("Frontend — Services & Types", [
        "frontend/src/services/api.ts",
        "frontend/src/types.ts",
    ]),
    ("Frontend — Core Components", [
        "frontend/src/components/NavigationChat.tsx",
        "frontend/src/components/RouteOptionsView.tsx",
        "frontend/src/components/SosAlertView.tsx",
        "frontend/src/components/QRScanner.tsx",
    ]),
]


def code_table(lines, font_size=6.0):
    row_h = font_size * 1.5
    ln_w  = 8 * mm
    cd_w  = INNER_W - ln_w - 2 * mm
    rows  = []
    for i, raw in enumerate(lines, 1):
        line = raw.rstrip("\n").replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
        if len(line) > 148: line = line[:145] + "…"
        rows.append([
            Paragraph(f'<font color="#4a5568" size="{font_size-0.5}">{i}</font>',
                      ParagraphStyle("ln", fontName="Courier", fontSize=font_size-0.5, leading=row_h, alignment=TA_RIGHT)),
            Paragraph(f'<font name="Courier" size="{font_size}" color="#e2e8f0">{line or " "}</font>',
                      ParagraphStyle("cd", fontName="Courier", fontSize=font_size, leading=row_h, wordWrap="CJK")),
        ])
    if not rows:
        rows = [["", Paragraph('<font name="Courier" size="6" color="#64748b">(empty)</font>',
                               ParagraphStyle("e", fontName="Courier", fontSize=6))]]
    t = Table(rows, colWidths=[ln_w, cd_w], rowHeights=row_h)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), CODE_BG),
        ("LEFTPADDING",   (0,0),(0,-1),  2),
        ("RIGHTPADDING",  (0,0),(0,-1),  3),
        ("LEFTPADDING",   (1,0),(1,-1),  4),
        ("RIGHTPADDING",  (1,0),(1,-1),  3),
        ("TOPPADDING",    (0,0),(-1,-1), 0.4),
        ("BOTTOMPADDING", (0,0),(-1,-1), 0.4),
        ("VALIGN",        (0,0),(-1,-1), "TOP"),
        ("LINEAFTER",     (0,0),(0,-1),  0.4, colors.HexColor("#1e3a5f")),
    ]))
    return t


class Header:
    def draw(self, c: canvas.Canvas, doc):
        c.saveState()
        c.setFillColor(NAVY)
        c.rect(0, PAGE_H - 11*mm, PAGE_W, 11*mm, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(MARGIN, PAGE_H - 7.5*mm, "CampusPilot AI — Core Source Code")
        c.setFont("Helvetica", 7)
        c.drawRightString(PAGE_W - MARGIN, PAGE_H - 7.5*mm, f"Page {doc.page}  |  {REPO_URL}")
        c.setStrokeColor(TEAL_LIGHT)
        c.setLineWidth(1)
        c.line(0, PAGE_H - 11*mm, PAGE_W, PAGE_H - 11*mm)
        c.restoreState()


def build(base_dir, output_path):
    base  = Path(base_dir)
    story = []
    hdr   = Header()

    BD = ParagraphStyle("BD", fontName="Helvetica",      fontSize=9,   leading=13, textColor=colors.HexColor("#1e293b"))
    SM = ParagraphStyle("SM", fontName="Helvetica",      fontSize=7.5, leading=11, textColor=GREY_MID)
    FH = ParagraphStyle("FH", fontName="Helvetica-Bold", fontSize=8,   leading=10, textColor=WHITE)
    FM = ParagraphStyle("FM", fontName="Helvetica",      fontSize=6.5, leading=9,  textColor=colors.HexColor("#94a3b8"))
    SL = ParagraphStyle("SL", fontName="Helvetica-Bold", fontSize=9,   leading=12, textColor=WHITE)

    # Cover
    story.append(Spacer(1, 14*mm))
    cov = Table([[Paragraph("CampusPilot AI", ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=22, textColor=WHITE))]],
                colWidths=[INNER_W])
    cov.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), NAVY),
        ("LEFTPADDING",   (0,0),(-1,-1), 10*mm),
        ("TOPPADDING",    (0,0),(-1,-1), 10*mm),
        ("BOTTOMPADDING", (0,0),(-1,-1), 5*mm),
    ]))
    story.append(cov)
    story.append(Spacer(1, 4*mm))
    story.append(HRFlowable(width=INNER_W, thickness=2, color=TEAL_LIGHT, spaceAfter=3*mm))
    story.append(Paragraph("Core Source Code", ParagraphStyle("sub", fontName="Helvetica-Bold", fontSize=13, textColor=NAVY, spaceAfter=2*mm)))
    story.append(Paragraph("AI-Powered Accessible Campus Navigation  |  CapGemini Build-a-thon 2026", BD))
    story.append(Spacer(1, 4*mm))
    meta = Table([
        ["Repository", REPO_URL],
        ["Generated",  DATE_STR],
        ["License",    "Apache-2.0"],
    ], colWidths=[28*mm, INNER_W-28*mm])
    meta.setStyle(TableStyle([
        ("FONT",         (0,0),(0,-1), "Helvetica-Bold", 8),
        ("FONT",         (1,0),(1,-1), "Helvetica",      8),
        ("TEXTCOLOR",    (0,0),(0,-1), NAVY),
        ("TEXTCOLOR",    (1,0),(1,-1), colors.HexColor("#1e293b")),
        ("LEFTPADDING",  (0,0),(-1,-1), 5),
        ("TOPPADDING",   (0,0),(-1,-1), 4),
        ("BOTTOMPADDING",(0,0),(-1,-1), 4),
        ("GRID",         (0,0),(-1,-1), 0.4, GREY_RULE),
        ("ROWBACKGROUNDS",(0,0),(-1,-1), [GREY_LIGHT, colors.HexColor("#f8fafc")]),
    ]))
    story.append(meta)
    story.append(PageBreak())

    # Sections
    for sec_name, files in CORE_FILES:
        banner = Table([[Paragraph(f"  {sec_name}", SL)]], colWidths=[INNER_W])
        banner.setStyle(TableStyle([
            ("BACKGROUND",    (0,0),(-1,-1), NAVY),
            ("LEFTPADDING",   (0,0),(-1,-1), 6),
            ("TOPPADDING",    (0,0),(-1,-1), 4),
            ("BOTTOMPADDING", (0,0),(-1,-1), 4),
        ]))
        story.append(banner)
        story.append(Spacer(1, 2*mm))

        for rel in files:
            fp = base / rel
            if not fp.exists():
                continue
            name = Path(rel).name
            ext  = Path(rel).suffix.lower()
            lang = {".py":"Python",".ts":"TypeScript",".tsx":"TypeScript/React",
                    ".cypher":"Cypher",".json":"JSON",".md":"Markdown"}.get(ext,"Text")

            fh = Table([[Paragraph(f"  {name}", FH), Paragraph(f"{lang}  |  {rel}", FM)]],
                       colWidths=[38*mm, INNER_W-38*mm])
            fh.setStyle(TableStyle([
                ("BACKGROUND",    (0,0),(-1,-1), colors.HexColor("#1e3a5f")),
                ("LEFTPADDING",   (0,0),(-1,-1), 6),
                ("TOPPADDING",    (0,0),(-1,-1), 3),
                ("BOTTOMPADDING", (0,0),(-1,-1), 3),
                ("VALIGN",        (0,0),(-1,-1), "MIDDLE"),
            ]))

            with open(fp, "r", encoding="utf-8", errors="replace") as f:
                lines = f.readlines()

            story.append(fh)
            story.append(code_table(lines))
            story.append(Spacer(1, 3*mm))

        story.append(PageBreak())

    doc = SimpleDocTemplate(
        output_path, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=15*mm, bottomMargin=14*mm,
        title="CampusPilot AI — Core Source Code",
        author="CampusPilot AI Team",
    )
    doc.build(story, onFirstPage=hdr.draw, onLaterPages=hdr.draw)
    print(f"PDF generated: {output_path}")
    print(f"Size: {os.path.getsize(output_path)/1024/1024:.2f} MB")


if __name__ == "__main__":
    base   = os.path.dirname(os.path.abspath(__file__))
    output = os.path.join(base, "CampusPilot_AI_Core_Code.pdf")
    build(base, output)
