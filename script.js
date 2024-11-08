// 各エディターの要素を取得
const htmlEditor = document.getElementById('html-editor');
const cssEditor = document.getElementById('css-editor');
const jsEditor = document.getElementById('js-editor');
const previewFrame = document.getElementById('preview');

// エディターの内容が変更されたらプレビューを更新
htmlEditor.addEventListener('input', updatePreview);
cssEditor.addEventListener('input', updatePreview);
jsEditor.addEventListener('input', updatePreview);

// プレビュー更新関数
function updatePreview() {
    const htmlContent = htmlEditor.value;
    const cssContent = `<style>${cssEditor.value}</style>`;
    const jsContent = `<script>${jsEditor.value}<\/script>`;

    // iframeのコンテンツにHTML, CSS, JSを挿入
    const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document;
    previewDocument.open();
    previewDocument.write(htmlContent + cssContent + jsContent);
    previewDocument.close();
}
