export function ThemeScript() {
  return (
    <script
      id="theme-script"
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var theme=localStorage.getItem('groweasy-theme')||'dark';var root=document.documentElement;root.classList.toggle('dark',theme==='dark');root.style.colorScheme=theme;}catch(e){}})();`,
      }}
    />
  );
}