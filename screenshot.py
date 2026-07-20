import sys, re, subprocess, os
import time

html_path = 'presentation.html'
with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# remove all active classes
content = re.sub(r'class="slide active"', 'class="slide"', content)

# find all slide starts
slides = [m for m in re.finditer(r'<div class="slide([^"]*)">', content)]

for i in [0, 1, 2, 5]: # slides 1, 2, 3, 6 (0-indexed)
    if i < len(slides):
        m = slides[i]
        c = content[:m.start()] + '<div class="slide' + m.group(1) + ' active">' + content[m.end():]
        tmp_file = f'slide_{i+1}.html'
        with open(tmp_file, 'w', encoding='utf-8') as f:
            f.write(c)
        
        # take screenshot
        print(f'Taking screenshot of slide {i+1}...')
        subprocess.run(['msedge', '--headless', f'--screenshot=C:\\Users\\Admin\\.gemini\\antigravity\\brain\\98ead38f-e158-46cf-9106-04d493873359\\mobile_slide_{i+1}.png', '--window-size=430,932', f'file:///{os.path.abspath(tmp_file).replace(chr(92), "/")}'])
        time.sleep(1)
