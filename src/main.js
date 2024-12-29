import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { marked } from "marked";
import html2pdf from 'html2pdf.js';
import './style.css';

const updateDebounceRate = 300; // milliseconds

const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const updatePreview = debounce(() => {
  const markdown = editor.state.doc.toString();
  const html = marked(markdown);
  document.querySelector("#preview").innerHTML = html;
}, updateDebounceRate);

const editor = new EditorView({
  state: EditorState.create({
    doc: "test\n\n# test",
    extensions: [
      basicSetup,
      markdown(),
      EditorView.updateListener.of(updatePreview),
    ],
  }),
  parent: document.querySelector("#editor")
});

document.querySelector("#save-pdf").addEventListener("click", () => {
  let target = document.querySelector("#preview").cloneNode(true);
  // target.classList.remove('w-1/2');

  html2pdf().from(target).toPdf().get('pdf').then(pdf => {
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url);
  });
});

document.getElementById('font').addEventListener('change', (e) => {
  document.querySelector('#preview').style = `font-family: ${e.target.value}`;
});
