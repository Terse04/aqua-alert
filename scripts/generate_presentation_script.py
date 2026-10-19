import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def create_document():
    doc = docx.Document()

    # Define color palette
    NAVY = RGBColor(16, 59, 84)       # #103B54
    BLUE = RGBColor(8, 126, 188)      # #087EBC
    TEAL = RGBColor(19, 184, 166)     # #13B8A6
    SLATE = RGBColor(38, 55, 70)      # #263746
    GRAY = RGBColor(100, 116, 139)    # #64748B
    MUTED_BG = "F5F9FB"
    PALE_AQUA = "E9F8F7"
    AMBER_BG = "FEF3C7"
    AMBER_BORDER = "F59E0B"
    GREEN_BG = "ECFDF5"
    GREEN_BORDER = "10B981"

    # Set standard page margins (0.8 inch for clean printing & screen reading)
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Base style adjustments
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Arial'
    normal_style.font.size = Pt(10.5)
    normal_style.font.color.rgb = SLATE
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(4)

    # Helper functions for formatting
    def add_title(text, subtitle=None):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(2)
        run = p.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(22)
        run.font.bold = True
        run.font.color.rgb = NAVY

        if subtitle:
            p_sub = doc.add_paragraph()
            p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_sub.paragraph_format.space_after = Pt(14)
            run_sub = p_sub.add_run(subtitle)
            run_sub.font.name = 'Arial'
            run_sub.font.size = Pt(12)
            run_sub.font.color.rgb = BLUE
            run_sub.font.bold = True

    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(14)
        run.font.bold = True
        run.font.color.rgb = NAVY

        # Add a subtle decorative bottom line
        p_line = doc.add_paragraph()
        p_line.paragraph_format.space_before = Pt(0)
        p_line.paragraph_format.space_after = Pt(6)
        run_line = p_line.add_run("―" * 55)
        run_line.font.size = Pt(8)
        run_line.font.color.rgb = TEAL

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(12)
        run.font.bold = True
        run.font.color.rgb = BLUE

    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = TEAL

    def add_spoken_box(spoken_text, lead_label="WHAT TO SAY TO TEACHERS:"):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False
        table.columns[0].width = Inches(6.9)
        cell = table.cell(0, 0)
        
        # XML shading & border
        tcPr = cell._element.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{PALE_AQUA}"/>')
        tcPr.append(shd)
        borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:top w:val="none"/><w:left w:val="single" w:sz="28" w:space="0" w:color="087EBC"/><w:bottom w:val="none"/><w:right w:val="none"/></w:tcBorders>')
        tcPr.append(borders)
        
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        
        run_label = p.add_run(f"📢 {lead_label}\n")
        run_label.font.bold = True
        run_label.font.size = Pt(9.5)
        run_label.font.color.rgb = BLUE
        
        run_content = p.add_run(f'“{spoken_text}”')
        run_content.font.italic = True
        run_content.font.size = Pt(10.5)
        run_content.font.color.rgb = NAVY

        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    def add_demo_step(step_num, title, action_text, say_text, expected_text):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False
        table.columns[0].width = Inches(6.9)
        cell = table.cell(0, 0)

        tcPr = cell._element.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{MUTED_BG}"/>')
        tcPr.append(shd)
        borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:top w:val="none"/><w:left w:val="single" w:sz="32" w:space="0" w:color="13B8A6"/><w:bottom w:val="none"/><w:right w:val="none"/></w:tcBorders>')
        tcPr.append(borders)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)

        run_title = p.add_run(f"DEMONSTRATION STEP {step_num}: {title.upper()}\n")
        run_title.font.bold = True
        run_title.font.size = Pt(11)
        run_title.font.color.rgb = NAVY

        # ACTION
        run_act_lbl = p.add_run("👉 ACTION (What you do): ")
        run_act_lbl.font.bold = True
        run_act_lbl.font.size = Pt(10)
        run_act_lbl.font.color.rgb = BLUE
        run_act = p.add_run(f"{action_text}\n\n")
        run_act.font.size = Pt(10)

        # SAY
        run_say_lbl = p.add_run("🗣️ SAY (What you say): ")
        run_say_lbl.font.bold = True
        run_say_lbl.font.size = Pt(10)
        run_say_lbl.font.color.rgb = RGBColor(16, 59, 84)
        run_say = p.add_run(f'“{say_text}”\n\n')
        run_say.font.size = Pt(10.5)
        run_say.font.italic = True
        run_say.font.color.rgb = NAVY

        # EXPECTED RESULT
        run_exp_lbl = p.add_run("✅ EXPECTED RESULT (What teachers will see on screen): ")
        run_exp_lbl.font.bold = True
        run_exp_lbl.font.size = Pt(10)
        run_exp_lbl.font.color.rgb = RGBColor(16, 185, 129)
        run_exp = p.add_run(f"{expected_text}")
        run_exp.font.size = Pt(10)

        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    def add_callout(text, title="ACADEMIC PROJECT NOTE"):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False
        table.columns[0].width = Inches(6.9)
        cell = table.cell(0, 0)

        tcPr = cell._element.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{AMBER_BG}"/>')
        tcPr.append(shd)
        borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:top w:val="none"/><w:left w:val="single" w:sz="24" w:space="0" w:color="{AMBER_BORDER}"/><w:bottom w:val="none"/><w:right w:val="none"/></w:tcBorders>')
        tcPr.append(borders)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(3)

        run_title = p.add_run(f"⚠️ {title}: ")
        run_title.font.bold = True
        run_title.font.size = Pt(9.5)
        run_title.font.color.rgb = RGBColor(180, 83, 9)

        run_text = p.add_run(text)
        run_text.font.size = Pt(9.5)
        run_text.font.color.rgb = RGBColor(120, 53, 15)

        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # ---------------------------------------------------------------------------
    # COVER PAGE
    # ---------------------------------------------------------------------------
    add_title("AQUAALERT — SMART WATER CONSERVATION & LEAKAGE REPORTING SYSTEM",
              "Community Engagement Project (CEP) Presentation Script & Oral Defense Guide")

    # Metadata Table
    meta_table = doc.add_table(rows=6, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    meta_table.columns[0].width = Inches(2.2)
    meta_table.columns[1].width = Inches(4.7)

    meta_data = [
        ("Project Title:", "Water Scarcity"),
        ("Platform Name:", "AquaAlert (Smart Water Conservation & Leakage Reporting)"),
        ("Project Category:", "Second Year Information Technology Community Engagement Project (CEP)"),
        ("Target Study Geography:", "Selected Community in Wagholi, Pune, Maharashtra"),
        ("Intended Evaluators:", "College Faculty Mentors, Project Review Committee & Evaluators"),
        ("Document Purpose:", "Complete 12-15 Minute Presentation Speaking Script, Live Demonstration Sequence & Comprehensive Viva Voce Preparation Guide")
    ]

    for idx, (label, val) in enumerate(meta_data):
        row = meta_table.rows[idx]
        cell_lbl = row.cells[0]
        cell_val = row.cells[1]
        
        # Label cell
        p0 = cell_lbl.paragraphs[0]
        p0.paragraph_format.space_before = Pt(3)
        p0.paragraph_format.space_after = Pt(3)
        r0 = p0.add_run(label)
        r0.font.bold = True
        r0.font.size = Pt(10)
        r0.font.color.rgb = NAVY

        # Value cell
        p1 = cell_val.paragraphs[0]
        p1.paragraph_format.space_before = Pt(3)
        p1.paragraph_format.space_after = Pt(3)
        r1 = p1.add_run(val)
        r1.font.size = Pt(10)
        r1.font.color.rgb = SLATE

        # Subtle zebra shading
        bg = PALE_AQUA if idx % 2 == 0 else "FFFFFF"
        for c in (cell_lbl, cell_val):
            tcPr = c._element.get_or_add_tcPr()
            shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{bg}"/>')
            tcPr.append(shd)

    doc.add_page_break()

    # ---------------------------------------------------------------------------
    # TABLE OF CONTENTS / OUTLINE
    # ---------------------------------------------------------------------------
    add_h1("TABLE OF CONTENTS & PRESENTATION ROADMAP")
    
    sections_outline = [
        ("Section 1", "Opening Greeting & Self-Introduction", "1.0 min"),
        ("Section 2", "The Real-World Problem: Water Scarcity in Wagholi, Pune", "1.5 min"),
        ("Section 3", "Project Objectives & Scope", "1.0 min"),
        ("Section 4", "Proposed Solution: The AquaAlert Platform & Citizen Journey", "1.5 min"),
        ("Section 5", "Technology Stack & Technical Architecture (With Real-World Analogies)", "2.0 min"),
        ("Section 6", "In-Depth Tour of Every Website Page & Implemented Feature", "2.5 min"),
        ("Section 7", "Step-by-Step Live Website Demonstration Script (Action - Say - Expected Result)", "4.0 min"),
        ("Section 8", "End-to-End Complaint Data Workflow & Security Architecture", "1.0 min"),
        ("Section 9", "Water Consumption Calculator: Mathematical Formulas & Benchmarks", "1.0 min"),
        ("Section 10", "Privacy Safeguards, Cryptographic Hashes & Project Limitations", "1.0 min"),
        ("Section 11", "Community Benefits, Grassroots Impact & Behavioral Change", "1.0 min"),
        ("Section 12", "Real Implementation Challenges & Future Technical Scope", "1.0 min"),
        ("Section 13", "Project Conclusion, Summary & Thank You", "0.5 min"),
        ("Section 14", "Comprehensive Viva Voce Q&A Defense (25 Questions & Model Answers)", "Viva Defense"),
        ("Appendix", "Pre-Presentation Technical Checklist & Demo Data Reference", "Preparation"),
    ]

    toc_table = doc.add_table(rows=len(sections_outline)+1, cols=3)
    toc_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    toc_table.columns[0].width = Inches(1.3)
    toc_table.columns[1].width = Inches(4.3)
    toc_table.columns[2].width = Inches(1.3)

    hdr_cells = toc_table.rows[0].cells
    hdr_cells[0].paragraphs[0].add_run("SECTION").font.bold = True
    hdr_cells[1].paragraphs[0].add_run("TOPIC / CONTENT").font.bold = True
    hdr_cells[2].paragraphs[0].add_run("EST. DURATION").font.bold = True
    for c in hdr_cells:
        tcPr = c._element.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="087EBC"/>')
        tcPr.append(shd)
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        c.paragraphs[0].runs[0].font.size = Pt(9.5)

    for i, (sec, title, dur) in enumerate(sections_outline):
        row = toc_table.rows[i+1]
        row.cells[0].paragraphs[0].add_run(sec).font.size = Pt(9.5)
        row.cells[1].paragraphs[0].add_run(title).font.size = Pt(9.5)
        row.cells[2].paragraphs[0].add_run(dur).font.size = Pt(9.5)
        row.cells[0].paragraphs[0].runs[0].font.bold = True
        
        bg = PALE_AQUA if i % 2 == 0 else "FFFFFF"
        for c in row.cells:
            tcPr = c._element.get_or_add_tcPr()
            shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{bg}"/>')
            tcPr.append(shd)

    doc.add_page_break()

    # ---------------------------------------------------------------------------
    # SECTION 1: OPENING AND INTRODUCTION
    # ---------------------------------------------------------------------------
    add_h1("SECTION 1 — OPENING AND INTRODUCTION")
    p = doc.add_paragraph()
    p.add_run("Presenter Guidance: ").font.bold = True
    p.add_run("Stand upright, maintain comfortable eye contact with your evaluators, smile gently, and speak with a steady, clear voice. Do not rush through the greeting. Give the teachers 3 seconds to look at your introductory slide or screen before speaking.")

    add_spoken_box(
        "Good morning, respected teachers and evaluators. My name is [Your Name], and I am a Second Year student in the Department of Information Technology Engineering. "
        "Today, I am proud to present our Community Engagement Project titled 'Water Scarcity'. "
        "As part of this engineering community initiative, we have conceptualized, designed, and fully implemented a modern web platform named 'AquaAlert — Smart Water Conservation & Leakage Reporting System'. "
        "Our study area focuses on a selected residential community in Wagholi, Pune, Maharashtra. "
        "Our mission is simple yet vital: 'Every Drop Matters'. We have built a digital bridge that connects citizen vigilance with community water conservation.",
        "EXACT SCRIPT TO SPEAK:"
    )

    doc.add_paragraph(
        "Key Points to Emphasize in Introduction:\n"
        "• This is not just a theoretical report; it is a fully functioning, responsive web application built with modern engineering tools.\n"
        "• It directly addresses an ongoing socio-technical issue faced daily by residents in Pune’s eastern suburban corridors.\n"
        "• The platform is designed specifically with zero barrier to entry: citizens can report water leakages in under 30 seconds without creating an account or memorizing passwords."
    )

    # ---------------------------------------------------------------------------
    # SECTION 2: THE REAL-WORLD PROBLEM
    # ---------------------------------------------------------------------------
    add_h1("SECTION 2 — THE REAL-WORLD PROBLEM")
    add_h2("Why Water Scarcity Demands Engineering Attention in Wagholi, Pune")

    add_spoken_box(
        "Before discussing code and architecture, let us examine why water scarcity is an urgent crisis in our local surroundings. "
        "In rapidly growing suburban areas like Wagholi along Pune's Nagar Road corridor, high-rise residential societies have expanded faster than municipal piped water infrastructure. "
        "As a result, thousands of families depend heavily on private water tankers and deep groundwater borewells. "
        "A typical housing society spends tens of thousands of rupees every single month purchasing tanker water. "
        "Yet, when you walk through the neighborhood lanes in the morning, you frequently spot underground pipeline fractures with clean drinking water gushing onto the road, broken community taps leaking continuously, or overhead building tanks overflowing for over 45 minutes because someone forgot to turn off the pump. "
        "Because there is no simple, quick way for a resident on their morning commute to report these leaks, thousands of litres of treated or borewell water are lost into road drains every day before anyone takes action.",
        "EXACT SCRIPT TO SPEAK:"
    )

    doc.add_paragraph(
        "Core Dimensions of the Problem:\n"
        "1. Delayed Leak Detection: Underground joints crack due to road transit and construction vibration. Without quick reporting, leaks go unaddressed for days, eroding roads and wasting potable supply.\n"
        "2. The Tanker Paradox: Residents pay high tanker tariffs while simultaneous unmonitored standpost taps and tank overflows waste the very resource they are paying for.\n"
        "3. Lack of Household Accountability: Most urban residents have no idea how much water their daily activities consume compared to standard benchmarks like the CPHEEO urban guideline of 135 litres per person per day.\n"
        "4. Information Gap: Practical water-saving techniques—such as rainwater harvesting for borewell recharge, installing float valves on tanks, and reusing Reverse Osmosis (RO) reject water—are under-communicated."
    )

    add_callout(
        "Notice for Presenters: Never fabricate municipal data or invent specific survey percentages during your speech unless they are derived directly from the application database. Speak honestly about observable community patterns.",
        "ACADEMIC INTEGRITY GUIDELINE"
    )

    # ---------------------------------------------------------------------------
    # SECTION 3: PROJECT OBJECTIVES
    # ---------------------------------------------------------------------------
    add_h1("SECTION 3 — PROJECT OBJECTIVES")

    add_spoken_box(
        "To address these exact challenges, our project defines six clear engineering objectives:\n\n"
        "First, to create localized community awareness about water scarcity and sustainable conservation habits.\n\n"
        "Second, to provide a frictionless, zero-barrier reporting mechanism where any resident can report water wastage in under 30 seconds without mandatory registration.\n\n"
        "Third, to ensure privacy and security by giving reporters a cryptographic tracking secret code instead of exposing personal contact details to the public.\n\n"
        "Fourth, to build an interactive water consumption calculator that models household water use and compares it against national benchmarks with personalized conservation tips.\n\n"
        "Fifth, to collect genuine community field data on water shortage frequency, tanker reliance, and leakage observation through an anonymous survey module.\n\n"
        "And sixth, to provide an authorized coordinator dashboard where community volunteers can inspect incident photographs, review GPS coordinates, and manage resolution statuses.",
        "EXACT SCRIPT TO SPEAK:"
    )

    # ---------------------------------------------------------------------------
    # SECTION 4: PROPOSED SOLUTION: AQUAALERT
    # ---------------------------------------------------------------------------
    add_h1("SECTION 4 — PROPOSED SOLUTION: AQUAALERT")
    add_h2("The Citizen Experience & Platform Journey")

    add_spoken_box(
        "AquaAlert is our proposed solution. It is a modern, responsive web application designed with an eco-tech aesthetic. "
        "Let us understand the user journey of a typical resident:\n\n"
        "Imagine a Wagholi resident named Rajesh who is walking past BAIF Road in the morning and notices a burst roadside pipe gushing water. "
        "He scans a community AquaAlert QR code displayed at a nearby shop or opens the website on his mobile phone. "
        "He does not need to fill out a 10-field registration form or create a password. "
        "He taps 'Report Water Leakage', selects 'Pipeline Leakage', types the landmark, clicks 'Use Current GPS' to pin the location on our interactive OpenStreetMap, adds a photo from his camera, and hits Submit. "
        "Instantly, the system generates a unique Reference ID, such as AQA-2024-WAG78, and a private tracking secret code. "
        "The system stores only a one-way cryptographic SHA-256 hash of that code. "
        "Later that evening, Rajesh can open the 'Track' page, enter both values, and see that our student volunteer team verified the issue and notified the local society maintenance team. "
        "He also uses our built-in Water Calculator to check his family's consumption and reads practical guides on rainwater harvesting.",
        "EXACT SCRIPT TO SPEAK:"
    )

    add_callout(
        "Crucial Presentation Disclaimer: When speaking to your evaluators, explicitly clarify: 'AquaAlert is a student-developed Community Engagement Project intended to raise awareness and coordinate community stewardship. It is not an official government or municipal portal, and we do not claim automated municipal dispatch.'",
        "MANDATORY CEP DISCLAIMER"
    )

    # ---------------------------------------------------------------------------
    # SECTION 5: TECHNOLOGY STACK & ARCHITECTURE
    # ---------------------------------------------------------------------------
    add_h1("SECTION 5 — TECHNOLOGY STACK & ARCHITECTURE")
    add_h2("Explaining Each Tool with Real-World Analogies")

    add_spoken_box(
        "Respected teachers, we carefully selected our technology stack to ensure high performance, security, and mobile responsiveness. "
        "Let me explain each technology and its role using everyday analogies.",
        "EXACT SCRIPT TO SPEAK:"
    )

    tech_data = [
        ("React 19", "Frontend UI Library", "Builds component-driven user interfaces with fast state reactivity.", 
         "Like reusable LEGO blocks: We built one 'StatusBadge' or 'Navbar' component once and reused it across the entire website."),
        ("Vite 8", "Build Tool & Bundler", "Compiles TypeScript and bundles production assets in under 3 seconds.", 
         "Like an ultra-fast express delivery van that packages and delivers our code instantly to the browser."),
        ("TypeScript", "Strict Typed Language", "Prevents runtime bugs by enforcing data types at compile time.", 
         "Like a blueprint inspector: It ensures that a complaint object always has a valid reference ID and status before the app runs."),
        ("Tailwind CSS v4", "Utility-First CSS Engine", "Provides our clean environmental design system and tokens.", 
         "Like an interior decorator's palette: It ensures our ocean navy, primary blue, and turquoise colors stay uniform across every page."),
        ("Leaflet & OpenStreetMap", "Interactive Map Picker", "Renders lightweight maps and pins coordinates without expensive Google Maps API keys.", 
         "Like an interactive pinboard where residents point directly to where the pipe is broken."),
        ("Recharts", "Data Visualization", "Renders responsive SVG charts for water consumption and survey analytics.", 
         "Like an automated accountant that turns raw litres and survey counts into intuitive visual graphs."),
        ("Zod", "Schema Validation", "Validates form inputs on both client and edge runtimes.", 
         "Like a security gatekeeper: If someone tries to upload a 20 MB video or an empty description, Zod rejects it immediately with helpful guidance."),
        ("Web Crypto API (SHA-256)", "Cryptographic Hashing", "Hashes tracking secrets so raw passwords or codes are never saved in plaintext.", 
         "Like a paper shredder with a pattern: You can verify that a piece of paper matches the pattern, but you cannot reverse the shredded pieces back into the original code."),
        ("Vitest", "Automated Testing Suite", "Executes unit and integration test suites in under 1 second.", 
         "Like an automated crash-test facility that tests our calculator formulas and tracking logic every time we make changes."),
        ("Supabase (PostgreSQL + RLS)", "Backend Database & Auth", "Provides relational SQL persistence, private file storage, and Row Level Security.", 
         "Like a bank vault with distinct keycards: Public users can drop reports into the night deposit slot, but only verified administrators can enter the vault to update records."),
    ]

    tech_table = doc.add_table(rows=len(tech_data)+1, cols=4)
    tech_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    tech_table.columns[0].width = Inches(1.3)
    tech_table.columns[1].width = Inches(1.3)
    tech_table.columns[2].width = Inches(2.2)
    tech_table.columns[3].width = Inches(2.1)

    th_cells = tech_table.rows[0].cells
    th_cells[0].paragraphs[0].add_run("TECHNOLOGY").font.bold = True
    th_cells[1].paragraphs[0].add_run("ROLE").font.bold = True
    th_cells[2].paragraphs[0].add_run("WHY WE USED IT").font.bold = True
    th_cells[3].paragraphs[0].add_run("REAL-WORLD ANALOGY").font.bold = True
    for c in th_cells:
        tcPr = c._element.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="103B54"/>')
        tcPr.append(shd)
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        c.paragraphs[0].runs[0].font.size = Pt(9)

    for i, (name, role, why, analogy) in enumerate(tech_data):
        row = tech_table.rows[i+1]
        row.cells[0].paragraphs[0].add_run(name).font.size = Pt(9)
        row.cells[0].paragraphs[0].runs[0].font.bold = True
        row.cells[1].paragraphs[0].add_run(role).font.size = Pt(9)
        row.cells[2].paragraphs[0].add_run(why).font.size = Pt(9)
        row.cells[3].paragraphs[0].add_run(analogy).font.size = Pt(9)
        
        bg = PALE_AQUA if i % 2 == 0 else "FFFFFF"
        for c in row.cells:
            tcPr = c._element.get_or_add_tcPr()
            shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{bg}"/>')
            tcPr.append(shd)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    add_h3("Clarifying Frontend vs Backend vs Database vs Security")
    doc.add_paragraph(
        "Teachers frequently test student understanding on architectural layers. Remember these simple definitions:\n"
        "• Frontend: What runs in the user's browser (HTML, CSS, React, TypeScript). It handles the user interface, buttons, and immediate validation.\n"
        "• Backend & Edge Functions: What runs on the server (Supabase Deno Edge Functions). It verifies credentials, compares hashes, and communicates safely with the database.\n"
        "• Database: Where records live permanently (PostgreSQL tables: complaints, complaint_status_history, admin_users, community_surveys, feedback).\n"
        "• Row Level Security (RLS): Database-level rules that forbid anonymous users from reading other people's complaints or viewing internal notes."
    )

    # ---------------------------------------------------------------------------
    # SECTION 6: EXPLAIN EVERY WEBSITE PAGE
    # ---------------------------------------------------------------------------
    add_h1("SECTION 6 — EXPLAIN EVERY WEBSITE PAGE")
    add_h2("Comprehensive Tour of the 9 Implemented Routes")

    pages_info = [
        ("A. Home Page ('/')",
         "The landing experience creates an immediate eco-tech impression. It features our custom AquaAlert SVG droplet emblem, a prominent student CEP badge identifying Wagholi, and live database telemetry tiles showing real complaints logged, under review, and resolved. It breaks the user journey into 3 intuitive steps (Identify -> Submit -> Track) and highlights our 6 platform capabilities. The footer prominently displays the student CEP academic disclaimer."),
        
        ("B. Leakage Reporting ('/report')",
         "A mobile-friendly 5-step form where residents report wastage. Fields include Issue Type (Pipeline Leakage, Broken Tap, Tank Overflow, Other), Area/Landmark text, interactive Leaflet OpenStreetMap with Wagholi default coordinates (18.5793° N, 73.9812° E) and a GPS detection button, detailed problem description, and optional photo upload with thumbnail preview. On submission, Zod validates inputs, persists the record, generates a non-sequential Reference ID (e.g., AQA-2024-WAG01) and an unguessable tracking code (e.g., TRK-WAG1-DEMO), and presents a professional confirmation modal with one-click copy and tracking buttons."),
        
        ("C. Complaint Tracking ('/track')",
         "Allows residents to check complaint progress without an account. It requires both the Reference ID and private tracking secret code. It computes a SHA-256 hash and performs constant-time verification. On success, it displays a 4-stage visual progress timeline (Pending -> Under Review -> In Progress -> Resolved), issue category, date, and historical audit notes. To protect citizen privacy, private phone numbers and coordinates are omitted. It also features 1-click demo autofill buttons for evaluation."),
        
        ("D. Water Consumption Calculator ('/calculator')",
         "An interactive household water footprint estimator. Inputs include household size, bathing habit (bucket ~18L vs shower ~9.5L/min with duration slider), weekly laundry loads (~55L/load), utensil washing minutes (~5L/min), toilet cistern type (dual 4.5L vs single standard 9L with flushes slider), floor mopping, and miscellaneous cooking/drinking water. It dynamically recalculates daily and monthly totals, per-person usage, compares against the CPHEEO urban benchmark of 135 L/person/day, and renders a Recharts doughnut chart and horizontal bar breakdown with ranked top contributors."),
         
        ("E. Water Conservation Awareness ('/awareness')",
         "A structured educational handbook tailored to Wagholi housing societies. It includes quick navigation pills covering: Root Causes & Local Effects, Rainwater Harvesting (rooftop catchment, first-flush diverter, borewell percolation recharge), Overhead Tank Overflow Prevention (automatic water level controller float switches), Silent Leak Detection Tests (the 20-minute water meter test and toilet cistern dye test), and RO Reject Water Reuse for floor mopping."),
         
        ("F. Community Survey & Analytics ('/community')",
         "Features a dual-tab experience: Tab 1 allows residents to submit an anonymous 6-question survey regarding water shortage frequency, primary water source (tanker vs borewell vs municipal), awareness levels, and willingness to report leaks. Tab 2 visualizes verified community analytics computed directly from submitted database records using 4 responsive Recharts charts with sample size indicators."),
         
        ("G. Feedback & Suggestions ('/feedback')",
         "Allows visitors to provide constructive feedback across 5 categories with an interactive 5-star rating control, comments textarea, and optional follow-up name. Submissions are stored securely and viewable only by authorized administrators."),
         
        ("H. Administrator Dashboard ('/admin')",
         "Protected portal accessible only after admin authentication. It presents genuine database telemetry counters, Recharts status and issue-type distribution charts, and a full complaint management table with search and filters. Clicking 'Review & Update' opens a detail modal with photo review, GPS coordinates, reporter contact notes, and an authorized workflow to update complaint statuses (e.g. from Pending to In Progress or Resolved) with mandatory milestone notes. It also contains directory tabs for survey responses and feedback."),
         
        ("I. About the CEP Project ('/about')",
         "Formal academic documentation outlining the problem statement, objectives, intended community benefits, scope, and technical limitations. Crucially, it houses a high-resolution, print-ready QR Code generator with 'Save Image' and 'Print Poster' actions designed for college exhibition stalls and housing society noticeboards.")
    ]

    for title, desc in pages_info:
        add_h2(title)
        doc.add_paragraph(desc)

    doc.add_page_break()

    # ---------------------------------------------------------------------------
    # SECTION 7: STEP-BY-STEP LIVE DEMONSTRATION
    # ---------------------------------------------------------------------------
    add_h1("SECTION 7 — STEP-BY-STEP LIVE WEBSITE DEMONSTRATION")
    add_h2("The 10-Step Practical Demonstration Sequence (Action — Say — Expected Result)")

    doc.add_paragraph(
        "Presenter Instructions: Have the website open on your laptop running 'npm run dev' at http://localhost:5173. "
        "Keep your browser full screen. Follow these exact 10 steps in sequence. Each step tells you what to click, what to speak, and what the teachers should see."
    )

    demo_steps = [
        (
            1,
            "Introduce the Home Page",
            "Open http://localhost:5173 in Google Chrome or Edge. Ensure the top navbar is visible.",
            "Teachers, this is the AquaAlert homepage. As you can see, our visual design uses a calm ocean navy and pale aqua palette that feels professional and environmentally focused. In the header, an unobtrusive badge confirms that the app is running in persistent Demo Mode. Notice our genuine telemetry counters showing reports currently in the system.",
            "The homepage renders smoothly with modern typography, the custom SVG droplet emblem, student CEP label, and live telemetry cards."
        ),
        (
            2,
            "Showcase the Process and Capabilities",
            "Scroll down past the Hero section to 'How AquaAlert Works' and 'Platform Capabilities'.",
            "Here we explain the 3-step workflow: Identify, Submit, and Track. Further down, we present our core modules: leakage reporting, dual-credential tracking, household water calculation, conservation guides, and community surveys.",
            "Cards for the 3-step process and 6 capabilities are displayed cleanly with distinct icons and hover animations."
        ),
        (
            3,
            "Navigate to Leakage Reporting Form",
            "Click the 'Report Leak' button in the top navigation bar or the hero CTA button.",
            "Now let us simulate a real citizen reporting an incident. We navigate to the Report page. Notice that the user is not prompted to log in or create an account, eliminating friction for elderly or non-technical residents.",
            "The Report page (/report) loads, showing the multi-step form with Issue Type radio cards, landmark input, and interactive map."
        ),
        (
            4,
            "Fill In a Realistic Leakage Incident",
            "Select 'Pipeline Leakage'. In Landmark, type: 'Opposite Wagheshwar Temple Gate, Nagar Road, Wagholi'. In Description, type: 'Clean drinking water gushing from underground pipe joint near the roadside pavement for 2 hours.' On the map, drag the pin or click 'Use Current GPS'.",
            "I will select 'Pipeline Leakage', enter the landmark in Wagholi, and write a concise description. I can also drag our Leaflet map pin to pinpoint the exact road coordinates. If I were on mobile, clicking 'Use Current GPS' would request browser geolocation with explicit user consent.",
            "The form fields are populated, the Leaflet marker updates with latitude and longitude displayed in the coordinate badge."
        ),
        (
            5,
            "Submit the Report and Reveal Credentials",
            "Click the primary 'Submit Leakage Report' button at the bottom of the form.",
            "I will now click Submit. Behind the scenes, Zod validates our inputs, the system registers the complaint with an initial 'Pending' status, generates a unique Reference ID, and creates an unguessable private tracking secret code.",
            "The submission spinner completes and displays the 'Report Submitted Successfully' confirmation modal showing the Reference ID (e.g. AQA-2024-XXXXX) and Secret Code (e.g. TRK-XXXX-XXXX) with Copy buttons."
        ),
        (
            6,
            "Verify Cryptographic Complaint Tracking",
            "Click 'Track This Complaint Now' in the modal (or open /track and use the demo autofill button for 'AQA-2024-WAG01' / 'TRK-WAG1-DEMO'). Click 'Track Complaint Status'.",
            "The user is immediately taken to the Tracking page with their reference pre-filled. When we submit the secret code, the application verifies the cryptographic SHA-256 hash in constant-time. As you can see, the complaint appears with a 4-step progress pipeline, verified status, and milestone audit trail.",
            "The tracking result view appears showing the status badge, resolution progress bar, reported area, and status history timeline."
        ),
        (
            7,
            "Demonstrate the Water Consumption Calculator",
            "Click 'Calculator' in the navbar. Change household members from 4 to 5. Switch Bathing from 'Bucket' to 'Shower' and drag duration to 12 minutes. Observe instant recalculation.",
            "Now let us examine our Water Calculator. Watch how the numbers update dynamically as I adjust household parameters. Notice that when I switch from bucket bath to shower, daily consumption jumps significantly. The Recharts doughnut chart and horizontal category bars recalculate in real-time, comparing per-person usage against the CPHEEO urban benchmark of 135 litres.",
            "Totals, charts, and personalized tips recalculate instantly without any page refresh."
        ),
        (
            8,
            "Explain a Practical Awareness Guide",
            "Click 'Awareness' in the navbar. Click the 'Overhead Tank Overflows' or 'Rainwater Harvesting' tab.",
            "On our Awareness page, we provide localized, practical advice rather than generic tips. For example, in our Overhead Tank section, we explain how installing a simple automatic magnetic float switch prevents commercial and society tanks from overflowing thousands of litres into street drains.",
            "The awareness page displays structured topics, step-by-step guides, and practical Indian household tips."
        ),
        (
            9,
            "Show Survey Analytics and Feedback",
            "Click 'Community' in the navbar. Show the survey questions, then click 'View Community Analytics'.",
            "In our Community module, residents participate in our localized water research. In the Analytics tab, four dynamic charts visualize shortage frequency, primary water sources, conservation awareness, and community willingness—calculated directly from verified database records with sample size indicators.",
            "The survey analytics dashboard displays Recharts bar and pie charts reflecting live survey records."
        ),
        (
            10,
            "Demonstrate Administrator Dashboard & Status Update",
            "Click 'Admin' in navbar. On the login page, click 'Autofill Demo Admin Credentials' and click 'Access Dashboard'. In the complaint table, click 'Review & Update' on a Pending complaint. Change status to 'In Progress', type note: 'Verified by CEP student field team; society maintenance informed.', and click 'Apply Status Update'.",
            "Finally, let us enter the protected Administrator Dashboard. I log in as a coordinator. Here, live counters reflect all stored records. I can review incident photos, inspect GPS coordinates, and officially update a complaint from 'Pending' to 'In Progress' with resolution notes. This update immediately reflects on the resident's public tracking screen.",
            "The status updates successfully, a success banner appears, and the complaint list updates with the new 'In Progress' badge."
        ),
    ]

    for step_num, title, action, say, expected in demo_steps:
        add_demo_step(step_num, title, action, say, expected)

    doc.add_page_break()

    # ---------------------------------------------------------------------------
    # SECTION 8: COMPLAINT WORKFLOW & SECURITY ARCHITECTURE
    # ---------------------------------------------------------------------------
    add_h1("SECTION 8 — END-TO-END COMPLAINT WORKFLOW & ARCHITECTURE")
    add_h2("Data Flow from Citizen Report to Administrator Resolution")

    add_spoken_box(
        "Teachers, let me trace the complete lifecycle of a complaint to demonstrate our software engineering architecture:\n\n"
        "1. Citizen Input: A resident fills out the reporting form with issue type, landmark, GPS pin, description, and photo.\n"
        "2. Client Validation: Zod validates that text lengths and image file sizes are safe before any submission is attempted.\n"
        "3. Cryptographic Secret Generation: The system generates a memorable reference ID and an unguessable tracking secret code.\n"
        "4. SHA-256 Hashing: Using the Web Crypto API, the tracking secret is hashed into a 64-character hexadecimal digest. Only this hash is stored in the database. The plaintext secret is never saved.\n"
        "5. Storage & Persistence: In production, the photo is stored in a private Supabase Storage bucket, and records are inserted into the 'complaints' and 'complaint_status_history' tables.\n"
        "6. Dual-Credential Public Tracking: When a citizen tracks a report, the database verifies both the Reference ID and compares the hashed secret in constant time. Only non-sensitive public fields are returned.\n"
        "7. Administrator Review & Update: An authorized admin logs in, reviews incident photos and GPS pins, and updates the status with internal notes. The audit log appends a new milestone entry.",
        "EXACT SCRIPT TO SPEAK:"
    )

    doc.add_paragraph(
        "Architectural Data Flow Diagram (Linear Representation):\n"
        "┌──────────────────┐      ┌─────────────────────────┐      ┌──────────────────────────┐\n"
        "│  Citizen Device  │ ───► │  Zod Schema Validation  │ ───► │  Crypto SHA-256 Hashing  │\n"
        "└──────────────────┘      └─────────────────────────┘      └──────────────────────────┘\n"
        "                                                                         │\n"
        "                                                                         ▼\n"
        "┌──────────────────┐      ┌─────────────────────────┐      ┌──────────────────────────┐\n"
        "│  Public Tracking │ ◄─── │  Zero-Leakage Tracking  │ ◄─── │  Supabase DB / Local     │\n"
        "│  (Sanitized View)│      │  Constant-Time Verify   │      │  PostgreSQL with RLS     │\n"
        "└──────────────────┘      └─────────────────────────┘      └──────────────────────────┘\n"
        "                                                                         ▲\n"
        "                                                                         │\n"
        "                                                           ┌──────────────────────────┐\n"
        "                                                           │   Admin Review & Status  │\n"
        "                                                           │   Update (Role-Protected)│\n"
        "                                                           └──────────────────────────┘"
    )

    # ---------------------------------------------------------------------------
    # SECTION 9: WATER CONSUMPTION CALCULATION EXPLAINED
    # ---------------------------------------------------------------------------
    add_h1("SECTION 9 — WATER CONSUMPTION CALCULATION EXPLAINED")
    add_h2("Mathematical Model & Step-by-Step Numerical Example")

    add_spoken_box(
        "Teachers often ask: 'How does your calculator arrive at its figures? Are these measured values?' "
        "Our answer is clear: These are model-based statistical estimates grounded on Indian urban household plumbing standards published by the Central Public Health and Environmental Engineering Organisation (CPHEEO). "
        "Let me explain the exact arithmetic formulas used in our code.",
        "EXACT SCRIPT TO SPEAK:"
    )

    doc.add_paragraph(
        "Activity Calculation Formulas in AquaAlert:\n"
        "1. Bathing: Bucket Bath = Members × 18 Litres; Shower Bath = Members × (Duration in Minutes × 9.5 Litres/min).\n"
        "2. Laundry: (Weekly Machine/Bucket Loads × 55 Litres) ÷ 7 days.\n"
        "3. Utensil Dishwashing: Duration in Minutes with running tap × 5.0 Litres/min.\n"
        "4. Toilet Flushing: Members × Flushes per person × Litres per flush (4.5 L for Dual Flush; 9.0 L for Single Standard).\n"
        "5. Floor Mopping & Cleaning: Direct daily estimate entered by user (default 20 L).\n"
        "6. Cooking, Drinking & Misc: Direct daily estimate entered by user (default 25 L).\n"
        "• Daily Household Total = Bathing + Laundry + Utensils + Toilet + Cleaning + Other.\n"
        "• Estimated Monthly Total = Daily Household Total × 30 days.\n"
        "• Per-Person Daily Usage = Daily Household Total ÷ Number of Members."
    )

    # Numerical Walkthrough Table
    calc_table = doc.add_table(rows=7, cols=4)
    calc_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    calc_table.columns[0].width = Inches(2.2)
    calc_table.columns[1].width = Inches(1.8)
    calc_table.columns[2].width = Inches(1.4)
    calc_table.columns[3].width = Inches(1.5)

    c_hdrs = calc_table.rows[0].cells
    c_hdrs[0].paragraphs[0].add_run("ACTIVITY").font.bold = True
    c_hdrs[1].paragraphs[0].add_run("SAMPLE PARAMETERS").font.bold = True
    c_hdrs[2].paragraphs[0].add_run("DAILY USAGE").font.bold = True
    c_hdrs[3].paragraphs[0].add_run("PERCENTAGE").font.bold = True
    for c in c_hdrs:
        tcPr = c._element.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="087EBC"/>')
        tcPr.append(shd)
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        c.paragraphs[0].runs[0].font.size = Pt(9)

    calc_rows = [
        ("Bathing (Bucket)", "4 members × 18 L / bath", "72 Litres", "33.2%"),
        ("Toilet Flushing (Dual)", "4 members × 4 flushes × 4.5 L", "72 Litres", "33.2%"),
        ("Laundry", "4 loads/week × 55 L ÷ 7", "31 Litres", "14.3%"),
        ("Utensil Washing", "20 minutes × 5 L / min", "100 Litres (if running)", "Varied"),
        ("Cleaning & Mopping", "1 bucket mopping system", "20 Litres", "9.2%"),
        ("Cooking & Drinking", "Water purifier & cooking", "25 Litres", "10.1%"),
    ]

    for i, (act, param, daily, pct) in enumerate(calc_rows):
        row = calc_table.rows[i+1]
        row.cells[0].paragraphs[0].add_run(act).font.size = Pt(9)
        row.cells[1].paragraphs[0].add_run(param).font.size = Pt(9)
        row.cells[2].paragraphs[0].add_run(daily).font.size = Pt(9)
        row.cells[3].paragraphs[0].add_run(pct).font.size = Pt(9)
        
        bg = PALE_AQUA if i % 2 == 0 else "FFFFFF"
        for c in row.cells:
            tcPr = c._element.get_or_add_tcPr()
            shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{bg}"/>')
            tcPr.append(shd)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    add_spoken_box(
        "Illustrative Example to Speak Aloud:\n"
        "'For a standard 4-member family using bucket baths, dual-flush toilets, and running 4 loads of laundry a week, the estimated daily consumption is approximately 220 litres per day, or roughly 55 litres per person per day. "
        "This is well within the CPHEEO urban benchmark of 135 litres per day. "
        "However, if that same family takes 10-minute shower baths instead of bucket baths, their bathing water alone jumps from 72 litres to 380 litres per day, pushing their household usage to over 520 litres daily! "
        "Our calculator visually reveals this exact contrast to families.'",
        "HOW TO EXPLAIN THE NUMERICAL EXAMPLE:"
    )

    # ---------------------------------------------------------------------------
    # SECTION 10: PRIVACY, SECURITY, AND LIMITATIONS
    # ---------------------------------------------------------------------------
    add_h1("SECTION 10 — PRIVACY, SECURITY, AND LIMITATIONS")
    add_h2("Defending Our Data Protection Choices in Front of Teachers")

    add_spoken_box(
        "Teachers frequently ask how we protect user privacy in a public community portal. "
        "Here are our four deliberate architectural decisions:\n\n"
        "1. Minimal Personal Data: We do not force users to create accounts, provide phone numbers, or enter email addresses to report a leak. Zero personal data stored means zero personal data leaked.\n"
        "2. Cryptographic Secret Codes: When someone submits a report, the tracking secret code is hashed with SHA-256 before storage. Even if an attacker obtained database read access, they could not reverse the hash to impersonate the reporter.\n"
        "3. Constant-Time Verification: We compare tracking hashes in constant time to eliminate timing side-channel attacks.\n"
        "4. Restricted Public Queries: The tracking page never reveals the reporter's phone note, internal administrator notes, or precise coordinates. Only generalized landmark text and status history are returned.\n"
        "5. Private Photo Storage: In Supabase, the 'complaint-photos' bucket is private with Row Level Security. Only authenticated administrators can inspect photos.",
        "EXACT SCRIPT TO SPEAK:"
    )

    doc.add_paragraph(
        "Acknowledged Limitations (Be 100% Honest with Evaluators):\n"
        "• Academic Nature: AquaAlert is a student engineering initiative, not an integrated government municipal dispatch system. Submitting a report does not guarantee official municipal repair action.\n"
        "• Internet Dependency: Being a web application, users require active mobile data to submit reports on the road.\n"
        "• Model-Based Estimation: The water calculator provides benchmarked estimates, not physical flow-meter readings.\n"
        "• GPS Precision: Accuracy depends on mobile browser location permissions and user map pinning."
    )

    # ---------------------------------------------------------------------------
    # SECTION 11: COMMUNITY BENEFITS AND SOCIAL IMPACT
    # ---------------------------------------------------------------------------
    add_h1("SECTION 11 — COMMUNITY BENEFITS AND SOCIAL IMPACT")

    add_spoken_box(
        "As an Information Technology Community Engagement Project, our goal is not just writing software, but fostering community stewardship. "
        "Here is the real social impact AquaAlert provides:\n\n"
        "First, it bridges the notification gap. In Wagholi, when an underground valve leaks, residents often assume someone else has informed the society maintenance team. AquaAlert allows anyone to log it in seconds.\n\n"
        "Second, it drives behavioral change. When residents see on our calculator that a 12-minute shower wastes as much water as five bucket baths, it creates a personal conservation reflex.\n\n"
        "Third, it provides empirical community data. Our anonymous survey allows housing societies to identify common issues—such as excessive tanker spending or unmonitored tank overflows—and mobilize cooperative solutions like rainwater harvesting.",
        "EXACT SCRIPT TO SPEAK:"
    )

    # ---------------------------------------------------------------------------
    # SECTION 12: CHALLENGES AND FUTURE SCOPE
    # ---------------------------------------------------------------------------
    add_h1("SECTION 12 — CHALLENGES ENCOUNTERED & FUTURE SCOPE")

    doc.add_paragraph(
        "Engineering Challenges Encountered During Development:\n"
        "1. Zero-Account Tracking Privacy: Designing a secure tracking mechanism that didn't require user logins required implementing client/edge SHA-256 hashing and timing-safe equality.\n"
        "2. Zero-Value Coercion in Arithmetic: In JavaScript, treating zero inputs carefully (such as zero flushes or zero laundry loads) required strict isNaN checks to avoid falsy fallback bugs.\n"
        "3. Leaflet Bundling with React 19: Configuring dynamic map icons and container resize invalidation in a modern Vite 8 bundler environment without default asset path errors.\n"
        "4. Dual Storage Layer: Designing DataService to operate flawlessly in local demo mode with localStorage persistence while maintaining full compatibility with production Supabase PostgreSQL and Storage."
    )

    doc.add_paragraph(
        "Realistic Future Enhancements (Future Scope):\n"
        "• SMS / WhatsApp Status Alerts: Integrating Twilio or WhatsApp Business API to send progress updates when a complaint status changes.\n"
        "• Progressive Web App (PWA): Adding service workers and manifest files for offline report drafting and one-tap home screen installation.\n"
        "• IoT Ultrasonic Tank Sensor Integration: Linking low-cost ESP32 ultrasonic water-level sensors on overhead tanks to automatically alert society guards before overflow begins.\n"
        "• Multilingual Support: Translating the platform into Marathi and Hindi to expand accessibility for all community residents."
    )

    # ---------------------------------------------------------------------------
    # SECTION 13: CONCLUSION AND THANK YOU
    # ---------------------------------------------------------------------------
    add_h1("SECTION 13 — CONCLUSION AND THANK YOU")

    add_spoken_box(
        "In conclusion, respected teachers, water scarcity is not a distant future challenge; it is a present reality in our communities like Wagholi. "
        "Through AquaAlert, we have demonstrated how Second Year IT Engineering students can apply modern software architecture—including React, TypeScript, Leaflet, and Supabase PostgreSQL—to create a usable, secure, and meaningful community solution. "
        "Every drop saved through faster leak detection and conscious consumption protects our community's water security. "
        "Thank you for your time, mentorship, and attention. I am now ready to answer any questions you may have.",
        "EXACT SCRIPT TO SPEAK:"
    )

    doc.add_page_break()

    # ---------------------------------------------------------------------------
    # SECTION 14: 25 VIVA QUESTIONS AND MODEL ANSWERS
    # ---------------------------------------------------------------------------
    add_h1("SECTION 14 — COMPREHENSIVE VIVA VOCE Q&A DEFENSE")
    add_h2("25 Likely Teacher Questions with Simple, Accurate Answers")

    viva_qa = [
        ("Q1: Why did you choose 'Water Scarcity' as your Community Engagement Project topic?",
         "A1: We chose Water Scarcity because it is an acute, everyday reality in our study area of Wagholi, Pune. Due to rapid suburban growth outstripping municipal supply pipelines, local societies rely heavily on expensive private tankers. We wanted to build an IT solution that directly targets localized water wastage and delayed leak detection."),
        
        ("Q2: Why is the platform named 'AquaAlert'?",
         "A2: 'Aqua' represents water, and 'Alert' signifies fast community notification. The name highlights our core goal: alerting residents and maintenance teams about preventable water wastage before thousands of litres are lost."),
        
        ("Q3: What makes this a Community Engagement Project (CEP) rather than a regular commercial website?",
         "A3: A CEP focuses on social benefit, public participation, and community awareness. AquaAlert is non-commercial, requires no user payment, needs no login barriers, provides free household consumption calculations, and gathers anonymous community survey data for collective society improvement."),
        
        ("Q4: Why did you use React 19 instead of plain HTML, CSS, and vanilla JavaScript?",
         "A4: React allows us to break the application into modular, reusable components—such as our StatusBadge, LocationPicker, and Navigation bar. When state changes, like recalculating water usage or updating complaint statuses, React re-renders only the affected DOM elements efficiently without refreshing the entire page."),
        
        ("Q5: What is Vite and why was it preferred over Create React App (CRA)?",
         "A5: Vite is a modern frontend build tool that uses native ES modules. Unlike Create React App, which is outdated and slow to start, Vite provides near-instant Hot Module Replacement (HMR) and compiles our entire production bundle in under 3 seconds."),
        
        ("Q6: What is TypeScript and how does it help your project?",
         "A6: TypeScript adds static type checking to JavaScript. It ensures data integrity by enforcing strict interfaces for Complaints, StatusHistory, and SurveyResponse. If a developer accidentally misspells a property or passes a string where a number is expected, TypeScript catches it during compilation before deployment."),
        
        ("Q7: What is the difference between Frontend and Backend in your application?",
         "A7: The frontend is what runs in the user's browser (React, Tailwind CSS, Leaflet maps). The backend consists of our database (Supabase PostgreSQL) and serverless Edge Functions that process data, enforce security rules, and manage authenticated operations."),
        
        ("Q8: How does your complaint reference ID get generated?",
         "A8: In our crypto utility (lib/crypto.ts), we generate a non-sequential reference in the format 'AQA-YYYY-XXXXX', where YYYY is the current year and XXXXX is an unguessable 5-character alphanumeric string selected from non-ambiguous characters (avoiding easily confused letters like 0, O, 1, and I)."),
        
        ("Q9: How do residents track their complaints without an account?",
         "A9: When a resident submits a report, the platform generates a private Tracking Secret Code (e.g., TRK-XXXX-XXXX). To track progress, the resident visits /track and must enter both the Reference ID and the Secret Code. The system hashes the code with SHA-256 and compares it against the stored hash."),
        
        ("Q10: Why do you store a SHA-256 hash of the tracking secret instead of the plain text?",
         "A10: Storing plaintext secrets is a security vulnerability. By storing only the one-way cryptographic SHA-256 hash, even if someone accessed the database table, they cannot reverse the hash to discover the citizen's secret code."),
        
        ("Q11: What is 'constant-time equality' and why is it used in tracking?",
         "A11: Standard string comparison terminates as soon as the first mismatched character is found, which can allow attackers to guess secrets by measuring response times (timing attacks). Constant-time equality checks every byte regardless of mismatch, keeping execution time identical and preventing timing leaks."),
        
        ("Q12: Who is authorized to change a complaint's status?",
         "A12: Only verified administrators can change a complaint's status. In Supabase, this is enforced through PostgreSQL Row Level Security (RLS) linked to an admin_users allowlist table. Regular users only have INSERT permissions for complaints and cannot update statuses."),
        
        ("Q13: How does your Water Consumption Calculator estimate daily usage?",
         "A13: It uses mathematical activity formulas based on CPHEEO urban guidelines: bucket bathing (18 L/person), shower bathing (minutes × 9.5 L/min), laundry loads (55 L/load ÷ 7), dishwashing (minutes × 5 L/min), and toilet flushing (flushes × 4.5 L for dual flush or 9 L for single). The sum gives total daily household litres."),
        
        ("Q14: How is monthly water consumption calculated?",
         "A14: Monthly consumption is calculated as Daily Household Total × 30 days. We also divide the daily total by the number of household members to display per-person daily consumption."),
        
        ("Q15: Are your calculator values actual measured water usage?",
         "A15: No, they are statistical model estimates based on recognized Indian urban benchmarks. We explicitly explain this to users in our methodology accordion to ensure complete transparency."),
        
        ("Q16: How do you handle photographs attached to complaints?",
         "A16: On the client, files are validated to ensure they are JPEG, PNG, or WebP under 5 MB. In production, the photo is uploaded to a private Supabase Storage bucket ('complaint-photos') accessible only to authenticated admins. In demo mode, it is converted to a local Data URL for review."),
        
        ("Q17: What is Leaflet and why didn't you use Google Maps?",
         "A17: Leaflet is a lightweight, open-source JavaScript mapping library that works with OpenStreetMap tiles. It requires no billing setup or restrictive API keys, making it ideal for educational and community engagement projects."),
        
        ("Q18: What is Demo Mode and how does it work?",
         "A18: Demo Mode automatically activates when Supabase environment variables are absent. It uses browser localStorage to persist complaints, status updates, surveys, and feedback across page refreshes, and pre-populates realistic Wagholi sample records for instant testing."),
        
        ("Q19: Does AquaAlert automatically send complaints to PMC or municipal authorities?",
         "A19: No. AquaAlert is a student academic CEP project. We do not claim municipal integration. Reports are intended for community volunteers, housing society maintenance committees, and local awareness drives."),
        
        ("Q20: What are Row Level Security (RLS) policies in PostgreSQL?",
         "A20: RLS is a database security feature that restricts which table rows a user can SELECT, INSERT, UPDATE, or DELETE based on their authentication credentials, ensuring security rules are enforced at the database level rather than just in frontend JavaScript."),
        
        ("Q21: How do you ensure the community survey results are anonymous?",
         "A21: The survey form does not collect names, phone numbers, or email addresses. Submissions only record general locality and multiple-choice answers, and charts only display aggregate percentages with verified sample size counts."),
        
        ("Q22: What happens if there are no survey responses in the database?",
         "A22: Our Recharts visualization component handles empty states gracefully by displaying an informative card explaining that no survey submissions exist yet, inviting the user to be the first respondent."),
        
        ("Q23: How do you test the application for reliability?",
         "A23: We use Vitest to run automated unit and integration tests. Our test suites cover calculator arithmetic formulas, bucket vs shower variances, zero boundary values, SHA-256 cryptographic hashing, and localStorage service persistence."),
        
        ("Q24: How would you deploy this project to production for community use?",
         "A24: We would deploy the React frontend to Vercel or Netlify, connect it to a production Supabase PostgreSQL instance in Mumbai (ap-south-1), configure production environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY), and print QR codes linked to the deployed URL for community noticeboards."),
        
        ("Q25: If you had another month to work on AquaAlert, what features would you add?",
         "A25: We would add WhatsApp notifications for tracking updates, develop a Progressive Web App (PWA) for offline drafting, introduce Marathi language localization, and prototype an ESP32 ultrasonic water-level sensor to automatically detect tank overflows.")
    ]

    for q, a in viva_qa:
        p_q = doc.add_paragraph()
        p_q.paragraph_format.space_before = Pt(6)
        p_q.paragraph_format.space_after = Pt(2)
        p_q.paragraph_format.keep_with_next = True
        r_q = p_q.add_run(q)
        r_q.font.bold = True
        r_q.font.size = Pt(10.5)
        r_q.font.color.rgb = NAVY

        p_a = doc.add_paragraph()
        p_a.paragraph_format.space_before = Pt(0)
        p_a.paragraph_format.space_after = Pt(6)
        r_a = p_a.add_run(a)
        r_a.font.size = Pt(10)
        r_a.font.color.rgb = SLATE

    doc.add_page_break()

    # ---------------------------------------------------------------------------
    # APPENDIX: PRE-PRESENTATION CHECKLIST
    # ---------------------------------------------------------------------------
    add_h1("APPENDIX — PRE-PRESENTATION TECHNICAL CHECKLIST")
    add_h2("Final 15-Minute Preparation Before Facing the Evaluators")

    checklist_items = [
        ("1. Development Server Active", "Ensure 'npm run dev' is running in terminal. Verify http://localhost:5173 opens in your browser."),
        ("2. Test Demo Pre-seeded Codes", "Verify that tracking 'AQA-2024-WAG01' with 'TRK-WAG1-DEMO' works smoothly on the Track page."),
        ("3. Admin Demo Credentials Ready", "Verify you can log into /admin/login with email 'admin@aquaalert.org' and password 'AquaAdmin#2024'."),
        ("4. Browser View Zoom Level", "Set browser zoom to 100% or 110% so text and charts are clearly legible on the classroom projector."),
        ("5. Automated Test Suite", "Run 'npm test' in terminal beforehand so you can show evaluators that all 10 automated test suites pass."),
        ("6. Production Build Check", "Verify that 'npm run build' generates clean bundles in dist/ with zero TypeScript errors."),
        ("7. Speaking Rhythm", "Remember to speak naturally, pause briefly after showing a feature, and let the teachers absorb the visual design."),
    ]

    chk_table = doc.add_table(rows=len(checklist_items)+1, cols=2)
    chk_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    chk_table.columns[0].width = Inches(2.2)
    chk_table.columns[1].width = Inches(4.7)

    chk_hdrs = chk_table.rows[0].cells
    chk_hdrs[0].paragraphs[0].add_run("CHECKLIST ITEM").font.bold = True
    chk_hdrs[1].paragraphs[0].add_run("ACTION REQUIRED").font.bold = True
    for c in chk_hdrs:
        tcPr = c._element.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="103B54"/>')
        tcPr.append(shd)
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        c.paragraphs[0].runs[0].font.size = Pt(9.5)

    for i, (item, act) in enumerate(checklist_items):
        row = chk_table.rows[i+1]
        row.cells[0].paragraphs[0].add_run(item).font.size = Pt(9.5)
        row.cells[0].paragraphs[0].runs[0].font.bold = True
        row.cells[1].paragraphs[0].add_run(act).font.size = Pt(9.5)
        
        bg = PALE_AQUA if i % 2 == 0 else "FFFFFF"
        for c in row.cells:
            tcPr = c._element.get_or_add_tcPr()
            shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{bg}"/>')
            tcPr.append(shd)

    # Save to project root and documentation folder
    output_path = os.path.join(os.getcwd(), "AquaAlert_CEP_Project_Presentation_Script.docx")
    doc.save(output_path)
    print(f"Document successfully created at: {output_path}")

    # Also save a copy in documentation/ if appropriate
    docs_dir = os.path.join(os.getcwd(), "documentation")
    os.makedirs(docs_dir, exist_ok=True)
    doc_copy_path = os.path.join(docs_dir, "AquaAlert_CEP_Project_Presentation_Script.docx")
    doc.save(doc_copy_path)
    print(f"Backup copy saved at: {doc_copy_path}")

if __name__ == "__main__":
    create_document()
