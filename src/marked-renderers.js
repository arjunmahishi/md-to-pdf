export const renderers = {
  html(token) {
    switch (token.raw.trim()) {
      default:
        console.log(token.raw.trim());
        return token.raw;

      case "<page-break>": return `<div class="html2pdf__page-break"></div>`;
    }
  }
}
