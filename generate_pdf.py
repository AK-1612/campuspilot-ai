#!/usr/bin/env python3
"""
CampusPilot AI — Enterprise Source Code PDF Generator
"""

import os, datetime
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.pdfgen import canvas

NAVY       = colors.HexColor("#002f5c")
TEAL       = colors.HexColor("#00875a")
TEAL_LIGHT = colors.HexColor("#60f8cb")
GREY_DARK  = colors.HexColor("#1e293b")
GREY_MID   = colors.HexColor("#475569")
GREY_LIGHT = colors.HexColor("#f1f5f9")
GREY_RULE  = colors.HexColor("#e2e8f0")
CODE_BG    = colors.HexColor("#0f172a")
CODE_TEXT  = colors.HexColor("#e2e8f0")
WHITE      = colors.white

PAGE_W, PAGE_H = A4
MARGIN   = 20 * mm
INNER_W  = PAGE_W - 2 * MARGIN

REPO_URL = "https://github.com/AK-1612/campuspilot-ai"
TEAM     = "Anshul Kumaria · Dhruv Sarda · Hrishikesh Kali · Atharva Deshmukh · Rishabh Alekar"
EVENT    = "CapGemini Build-a-thon 2026"
DATE_STR = datetime.date.today().strftime("%B %d, %Y")

SECTIONS = [
    ("Backend — Core", [
        "backend/main.py", "backend/config.py", "backend/db_client.py",
    ]),
    ("Backend — Agent", [
        "backend/agent/agent.py", "backend/agent/intent_classifier.py",
        "backend/agent/memory.py", "backend/agent/tools.py",
        "backend/agent/profile_handler.py", "backend/agent/fallbacks.py",
        "backend/agent/prompts/system_prompt.md",
    ]),
    ("Backend — Routers", [
        "backend/routers/navigate.py", "backend/routers/qr.py",
        "backend/routers/alert.py", "backend/routers/__init__.py",
    ]),
    ("Backend — Tests", [
        "backend/tests/test_agent.py", "backend/tests/test_api.py",
        "backend/tests/test_tools.py", "backend/tests/run_tests.py",
    ]),
    ("Database", [
        "db/schema.cypher", "db/seed.cypher", "db/schema_notes.md",
    ]),
    ("Frontend — App Shell", [
        "frontend/src/main.tsx", "frontend/src/App.tsx",
        "frontend/src/types.ts", "frontend/src/data.ts",
        "frontend/src/services/api.ts",
    ]),
    ("Frontend — Components", [
        "frontend/src/components/CampusMap.tsx",
        "frontend/src/components/NavigationChat.tsx",
        "frontend/src/components/ActiveNavigationView.tsx",
        "frontend/src/components/OutdoorNavigationView.tsx",
        "frontend/src/components/RouteOptionsView.tsx",
        "frontend/src/components/QRScanner.tsx",
        "frontend/src/components/SOSScreen.tsx",
        "frontend/src/components/SosAlertView.tsx",
        "frontend/src/components/ProfileSelector.tsx",
        "frontend/src/components/AccessibilityView.tsx",
        "frontend/src/components/SavedMapsView.tsx",
        "frontend/src/components/BottomSheet.tsx",
        "frontend/src/components/LaptopLanding.tsx",
        "frontend/src/components/ReportIssueView.tsx",
    ]),
    ("Frontend — Config", [
        "frontend/vite.config.ts", "frontend/tsconfig.json", "frontend/package.json",
    ]),
    ("Evaluations", [
        "evals/run_eval.py", "evals/golden_queries.json",
    ]),
    ("Documentation", [
        "README.md", "docs/architecture.md", "docs/ai_architecture.md",
        "docs/problem_analysis.md", "docs/limitations_and_risks.md",
        "docs/acceptance_criteria/acceptance_criteria.md",
        "docs/research/tech_stack_rationale.md",
        "docs/adr/adr-001-neo4j.md", "docs/adr/adr-002-fastapi.md",
    ]),
]


def file_language(path):
    return {
        ".py": "Python", ".ts": "TypeScript", ".tsx": "TypeScript/React",
        ".json": "JSON", ".cypher": "Cypher (Neo4j)", ".md": "Markdown",
    }.get(Path(path).suffix.lower(), "Text")


def code_table(lines, font_size=6.0):
    row_h = font_size * 1.55
    ln_w  = 9 * mm
    cd_w  = INNER_W - ln_w - 4 * mm
    rows  = []
    for i, raw in enumerate(lines, 1):
        line = raw.rstrip("\n").replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
        if len(line) > 145:
            line = line[:142] + "…"
        ln = Paragraph(
            f'<font color="#4a5568" size="{font_size-0.5}">{i}</font>',
            ParagraphStyle("ln", fontName="Courier", fontSize=font_size-0.5,
                           leading=row_h, alignment=TA_RIGHT))
        cd = Paragraph(
            f'<font name="Courier" size="{font_size}" color="#e2e8f0">{line or " "}</font>',
            ParagraphStyle("cd", fontName="Courier", fontSize=font_size,
                           leading=row_h, wordWrap="CJK"))
        rows.append([ln, cd])
    if not rows:
        rows = [["", Paragraph('<font name="Courier" size="6" color="#64748b">(empty)</font>',
                               ParagraphStyle("e", fontName="Courier", fontSize=6))]]
    t = Table(rows, colWidths=[ln_w, cd_w], rowHeights=row_h)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), CODE_BG),
        ("LEFTPADDING",   (0,0),(0,-1),  3),
        ("RIGHTPADDING",  (0,0),(0,-1),  4),
        ("LEFTPADDING",   (1,0),(1,-1),  5),
        ("RIGHTPADDING",  (1,0),(1,-1),  4),
        ("TOPPADDING",    (0,0),(-1,-1), 0.5),
        ("BOTTOMPADDING", (0,0),(-1,-1), 0.5),
        ("VALIGN",        (0,0),(-1,-1), "TOP"),
        ("LINEAFTER",     (0,0),(0,-1),  0.5, colors.HexColor("#1e3a5f")),
    ]))
    return t


class PageDeco:
    def draw(self, c: canvas.Canvas, doc):
        c.saveState()
        c.setFillColor(NAVY)
        c.rect(0, PAGE_H - 14*mm, PAGE_W, 14*mm, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(MARGIN, PAGE_H - 9*mm, "CampusPilot AI")
        c.setFont("Helvetica", 7)
        c.drawRightString(PAGE_W - MARGIN, PAGE_H - 9*mm, "Complete Source Code  |  Confidential")
        c.setStrokeColor(TEAL_LIGHT)
        c.setLineWidth(1.2)
        c.line(0, PAGE_H - 14*mm, PAGE_W, PAGE_H - 14*mm)
        c.setStrokeColor(GREY_RULE)
        c.setLineWidth(0.5)
        c.line(MARGIN, 12*mm, PAGE_W - MARGIN, 12*mm)
        c.setFillColor(GREY_MID)
        c.setFont("Helvetica", 7)
        c.drawString(MARGIN, 7.5*mm, f"{EVENT}  |  {REPO_URL}")
        c.drawRightString(PAGE_W - MARGIN, 7.5*mm, f"Page {doc.page}")
        c.restoreState()


def build(base_dir, output_path):
    base  = Path(base_dir)
    deco  = PageDeco()
    story = []

    H1  = ParagraphStyle("H1",  fontName="Helvetica-Bold", fontSize=26, leading=32, textColor=WHITE)
    H2  = ParagraphStyle("H2",  fontName="Helvetica-Bold", fontSize=14, leading=18, textColor=WHITE)
    H3  = ParagraphStyle("H3",  fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=NAVY, spaceBefore=3*mm)
    BD  = ParagraphStyle("BD",  fontName="Helvetica",      fontSize=9,  leading=13, textColor=GREY_DARK)
    SM  = ParagraphStyle("SM",  fontName="Helvetica",      fontSize=7.5,leading=11, textColor=GREY_MID)
    FH  = ParagraphStyle("FH",  fontName="Helvetica-Bold", fontSize=8.5,leading=11, textColor=WHITE)
    FM  = ParagraphStyle("FM",  fontName="Helvetica",      fontSize=7,  leading=10, textColor=colors.HexColor("#94a3b8"))
    SL  = ParagraphStyle("SL",  fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=WHITE)
    SN  = ParagraphStyle("SN",  fontName="Helvetica-Bold", fontSize=18, leading=22, textColor=TEAL_LIGHT)

    # Cover
    story.append(Spacer(1, 18*mm))
    cov = Table([[Paragraph("CampusPilot AI", H1)]], colWidths=[INNER_W])
    cov.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), NAVY),
        ("LEFTPADDING",   (0,0),(-1,-1), 12*mm),
        ("TOPPADDING",    (0,0),(-1,-1), 16*mm),
        ("BOTTOMPADDING", (0,0),(-1,-1), 6*mm),
    ]))
    story.append(cov)
    story.append(Spacer(1, 6*mm))
    story.append(HRFlowable(width=INNER_W, thickness=2.5, color=TEAL_LIGHT, spaceAfter=4*mm))
    story.append(Paragraph("Complete Source Code", ParagraphStyle("sub", fontName="Helvetica-Bold", fontSize=16, textColor=NAVY, spaceAfter=2*mm)))
    story.append(Paragraph("AI-Powered Accessible Campus Navigation", BD))
    story.append(Spacer(1, 6*mm))

    meta = [
        ["Event",       EVENT],
        ["Team",        TEAM],
        ["Repository",  REPO_URL],
        ["Generated",   DATE_STR],
        ["License",     "Apache-2.0"],
    ]
    mt = Table(meta, colWidths=[32*mm, INNER_W-32*mm])
    mt.setStyle(TableStyle([
        ("FONT",         (0,0),(0,-1), "Helvetica-Bold", 8),
        ("FONT",         (1,0),(1,-1), "Helvetica",      8),
        ("TEXTCOLOR",    (0,0),(0,-1), NAVY),
        ("TEXTCOLOR",    (1,0),(1,-1), GREY_DARK),
        ("LEFTPADDING",  (0,0),(-1,-1), 5),
        ("TOPPADDING",   (0,0),(-1,-1), 4),
        ("BOTTOMPADDING",(0,0),(-1,-1), 4),
        ("GRID",         (0,0),(-1,-1), 0.4, GREY_RULE),
        ("ROWBACKGROUNDS",(0,0),(-1,-1), [GREY_LIGHT, colors.HexColor("#f8fafc")]),
    ]))
    story.append(mt)
    story.append(PageBreak())

    # TOC
    story.append(Paragraph("Table of Contents", H3))
    story.append(HRFlowable(width=INNER_W, thickness=1, color=GREY_RULE, spaceAfter=3*mm))
    toc_rows = []
    for n, (sec, files) in enumerate(SECTIONS, 1):
        toc_rows.append([
            Paragraph(f"{n}.", ParagraphStyle("tn", fontName="Helvetica-Bold", fontSize=9, textColor=NAVY)),
            Paragraph(sec,     ParagraphStyle("ts", fontName="Helvetica-Bold", fontSize=9, textColor=NAVY)),
            Paragraph(f"{len(files)} file{'s' if len(files)!=1 else ''}",
                      ParagraphStyle("tc", fontName="Helvetica", fontSize=8, textColor=GREY_MID, alignment=TA_RIGHT)),
        ])
        for f in files:
            toc_rows.append(["",
                Paragraph(f"  {f}", SM),
                Paragraph("" , SM)])
    tt = Table(toc_rows, colWidths=[8*mm, INNER_W-28*mm, 20*mm])
    tt.setStyle(TableStyle([("TOPPADDING",(0,0),(-1,-1),2),("BOTTOMPADDING",(0,0),(-1,-1),2),("LEFTPADDING",(0,0),(-1,-1),2)]))
    story.append(tt)
    story.append(PageBreak())

    # Sections
    for n, (sec, files) in enumerate(SECTIONS, 1):
        banner = Table([[Paragraph(f"  {n:02d}", SN), Paragraph(sec, SL)]],
                       colWidths=[16*mm, INNER_W-16*mm])
        banner.setStyle(TableStyle([
            ("BACKGROUND",    (0,0),(-1,-1), NAVY),
            ("LEFTPADDING",   (0,0),(-1,-1), 6),
            ("TOPPADDING",    (0,0),(-1,-1), 5),
            ("BOTTOMPADDING", (0,0),(-1,-1), 5),
            ("VALIGN",        (0,0),(-1,-1), "MIDDLE"),
        ]))
        story.append(KeepTogether([banner, Spacer(1, 3*mm)]))

        for rel in files:
            fp   = base / rel
            lang = file_language(rel)
            name = Path(rel).name

            fh = Table([[Paragraph(f"  {name}", FH), Paragraph(f"{lang}  |  {rel}", FM)]],
                       colWidths=[40*mm, INNER_W-40*mm])
            fh.setStyle(TableStyle([
                ("BACKGROUND",    (0,0),(-1,-1), colors.HexColor("#1e3a5f")),
                ("LEFTPADDING",   (0,0),(-1,-1), 6),
                ("TOPPADDING",    (0,0),(-1,-1), 4),
                ("BOTTOMPADDING", (0,0),(-1,-1), 4),
                ("VALIGN",        (0,0),(-1,-1), "MIDDLE"),
            ]))

            if not fp.exists():
                miss = Table([[Paragraph(f'<font name="Courier" size="7" color="#ef4444">  File not found: {rel}</font>',
                                         ParagraphStyle("m", fontName="Courier", fontSize=7))]],
                             colWidths=[INNER_W])
                miss.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),CODE_BG),("LEFTPADDING",(0,0),(-1,-1),6),("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4)]))
                story.append(KeepTogether([fh, miss, Spacer(1,3*mm)]))
                continue

            with open(fp, "r", encoding="utf-8", errors="replace") as f:
                lines = f.readlines()

            stat_str = f"  {len(lines)} lines  |  {fp.stat().st_size/1024:.1f} KB"
            st = Table([[Paragraph(stat_str, ParagraphStyle("s", fontName="Courier", fontSize=6.5, textColor=colors.HexColor("#94a3b8")))]],
                       colWidths=[INNER_W])
            st.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#0d1b2e")),("LEFTPADDING",(0,0),(-1,-1),6),("TOPPADDING",(0,0),(-1,-1),2),("BOTTOMPADDING",(0,0),(-1,-1),2)]))

            story.append(fh)
            story.append(st)
            story.append(code_table(lines))
            story.append(Spacer(1, 4*mm))

        story.append(PageBreak())

    # Back cover
    story.append(Spacer(1, 20*mm))
    back = Table([[Paragraph("End of Source Code", H2)]], colWidths=[INNER_W])
    back.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),NAVY),("LEFTPADDING",(0,0),(-1,-1),12*mm),("TOPPADDING",(0,0),(-1,-1),10*mm),("BOTTOMPADDING",(0,0),(-1,-1),10*mm)]))
    story.append(back)
    story.append(Spacer(1,5*mm))
    story.append(HRFlowable(width=INNER_W, thickness=1.5, color=TEAL_LIGHT, spaceAfter=4*mm))
    cl = Table([["Repository", REPO_URL], ["Team", TEAM], ["Event", EVENT], ["Date", DATE_STR]],
               colWidths=[28*mm, INNER_W-28*mm])
    cl.setStyle(TableStyle([
        ("FONT",(0,0),(0,-1),"Helvetica-Bold",8),("FONT",(1,0),(1,-1),"Helvetica",8),
        ("TEXTCOLOR",(0,0),(0,-1),NAVY),("TEXTCOLOR",(1,0),(1,-1),GREY_DARK),
        ("LEFTPADDING",(0,0),(-1,-1),5),("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4),
        ("GRID",(0,0),(-1,-1),0.4,GREY_RULE),
        ("ROWBACKGROUNDS",(0,0),(-1,-1),[GREY_LIGHT, colors.HexColor("#f8fafc")]),
    ]))
    story.append(cl)

    doc = SimpleDocTemplate(output_path, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=18*mm, bottomMargin=18*mm,
        title="CampusPilot AI — Complete Source Code",
        author="CampusPilot AI Team",
        subject="CapGemini Build-a-thon 2026")
    doc.build(story, onFirstPage=deco.draw, onLaterPages=deco.draw)
    print(f"PDF generated: {output_path}")
    print(f"Size: {os.path.getsize(output_path)/1024/1024:.2f} MB")


if __name__ == "__main__":
    base   = os.path.dirname(os.path.abspath(__file__))
    output = os.path.join(base, "CampusPilot_AI_Source_Code.pdf")
    build(base, output)
