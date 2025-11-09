import os
import hashlib

from jsmin import jsmin
import rcssmin

def obfuscate_js(code):
    junk = lambda: "(()=>{var a=Math.random().toString();eval(a)})()"
    junked = f"{code} /*{junk()}*/"
    return jsmin(junked)

def build():
    # Minifica JS
    js = open('engine/crypto.js').read()
    open('dist/crypto.min.js', 'w').write(obfuscate_js(js))
    
    # Minifica CSS
    css = open('assets/style.css').read()
    open('dist/style.min.css', 'w').write(rcssmin.cssmin(css))
    
    # Gera hash anti-tamper
    hasher = hashlib.sha256()
    hasher.update(js.encode())
    hash_file = hasher.hexdigest()[:8]
    
    print(f"Build completed! Hash: {hash_file}")

if __name__ == "__main__":
    build()
