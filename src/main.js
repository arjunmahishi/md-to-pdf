import { EditorView, basicSetup } from "codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { marked } from "marked";
import './style.css';

// Create the editor
const editor = new EditorView({
  doc: "test\n\n# test",
  extensions: [basicSetup, markdown(),],
  parent: document.getElementById("editor")
});

const updatePreview = () => {
  const markdown = editor.state.doc.toString();
  const html = marked(markdown);
  document.getElementById("preview").innerHTML = html;
}

setInterval(updatePreview, 1000);
