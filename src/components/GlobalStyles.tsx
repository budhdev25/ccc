import { useTheme } from "../hooks/useTheme";

// Global keyframes, scrollbar, placeholder + focus styles, and the Outfit font.
// Ported from the preview's <style> block + <link>.
export function GlobalStyles() {
  const { C } = useTheme();
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body,#root{height:100%;width:100%;}
        body{font-feature-settings:"ss01","cv01";}
        @keyframes slideInRight{from{opacity:0;transform:translateX(30px);}to{opacity:1;transform:translateX(0);}}
        @keyframes ring{0%{opacity:0.6;transform:scale(1);}100%{opacity:0;transform:scale(2.2);}}
        @keyframes wave{0%,100%{transform:scaleY(0.3);}50%{transform:scaleY(1);}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.45;}}
        ::-webkit-scrollbar{width:6px;height:6px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px;}
        ::-webkit-scrollbar-thumb:hover{background:${C.borderAcc}80;}
        input::placeholder,textarea::placeholder{color:${C.textDim};}
        button:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible{outline:2px solid ${C.borderAcc};outline-offset:1px;}
      `}</style>
    </>
  );
}
