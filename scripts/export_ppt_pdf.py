"""Export PPTX to PDF using Microsoft PowerPoint COM."""
import os
import sys

pptx = r"c:\FitTrack\docs\FitTrack_WPL_Mini_Project_Presentation.pptx"
pdf = r"c:\FitTrack\docs\FitTrack_WPL_Mini_Project_Presentation.pdf"
downloads_pptx = r"c:\Users\Neel Parikh\Downloads\FitTrack_WPL_Mini_Project_Presentation.pptx"
downloads_pdf = r"c:\Users\Neel Parikh\Downloads\FitTrack_WPL_Mini_Project_Presentation.pdf"

import shutil

try:
    import win32com.client
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pywin32"])
    import win32com.client

# PowerPoint constants
ppSaveAsPDF = 32

powerpoint = win32com.client.Dispatch("PowerPoint.Application")
powerpoint.Visible = 1
try:
    presentation = powerpoint.Presentations.Open(os.path.abspath(pptx), WithWindow=False)
    # Export as PDF
    presentation.SaveAs(os.path.abspath(pdf), ppSaveAsPDF)
    presentation.Close()
    print(f"Saved PDF: {pdf}")
finally:
    powerpoint.Quit()

shutil.copy2(pptx, downloads_pptx)
shutil.copy2(pdf, downloads_pdf)
print(f"Copied to Downloads:\n  {downloads_pptx}\n  {downloads_pdf}")
print("Sizes:", os.path.getsize(pptx), os.path.getsize(pdf))
