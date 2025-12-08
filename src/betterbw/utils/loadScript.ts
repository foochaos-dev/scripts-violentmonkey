// Helper to dynamically load a script
export function loadScript(url: string): Promise<void> {
  console.log('🪵 ~ loadScript ~ url:', url);
  console.log('===================== loadScript', url);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    document.head.appendChild(script);
    console.log('================== appended!');
  });
}
