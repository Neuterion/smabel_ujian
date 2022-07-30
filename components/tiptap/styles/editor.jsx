export default function ContentStyles() {
  return (
    <style global jsx>{`
      .ProseMirror {
        padding: 0.5rem;
        outline: none;
      }
      .ProseMirror > * + * {
        margin-top: 0.5rem;
      }
      .ProseMirror ul, .ProseMirror ol {
        padding: 0 1rem;
        margin: 0.75rem 0.75rem 0 0.75rem;
      }
      .ProseMirror ul {
        padding: 0 1rem;
        list-style-type: disc;
      }
      .ProseMirror ol {
        padding: 0 1rem;
        list-style-type: decimal;
      }
      .ProseMirror h1 {
        font-size: 3.75rem; /* 60px */
        font-weight: 700;
      }
      .ProseMirror h2 {
        font-size: 3rem; /* 48px */
        font-weight: 700;
      }
      .ProseMirror h3 {
        font-size: 2.25rem; /* 36px */
        font-weight: 600;
      }
      .ProseMirror h4 {
        font-size: 1.875rem; /* 30px */
        font-weight: 600;
      }
      .ProseMirror h5 {
        font-size: 1.5rem; /* 24px */
        font-weight: 500;
      }
      .ProseMirror h6 {
        font-size: 1.25rem; /* 20px */
        font-weight: 500;
      }
      .ProseMirror p {
        font-size: 1.125rem; /* 20px */
      }
      .ProseMirror code {
        background-color: rgba(97, 97, 97, 0.1);
        color: #616161;
      }
      .ProseMirror pre {
        background: #0D0D0D;
        color: #FFF;
        font-family: 'JetBrainsMono', monospace;
        padding: 0.75rem 1rem;
        margin-top: 0.25rem;
        border-radius: 0.5rem;
      }
      .ProseMirror pre code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }
      .ProseMirror img {
        max-width: 100%;
        height: auto;
        pointer-events: auto;
        user-select: auto;
      }
      .ProseMirror blockquote {
        margin-left: 1rem;
        padding-left: 1rem;
        border-left: 2px solid rgba(13, 13, 13, 0.1);
      }
      .ProseMirror hr {
        border: none;
        border-top: 2px solid rgba(13, 13, 13, 0.1);
        margin: 2rem 0;
      }
    `}</style>
  )
}