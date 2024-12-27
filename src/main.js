import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { marked } from "marked";
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
  document.getElementById("preview").innerHTML = html;
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
  parent: document.getElementById("editor")
});

