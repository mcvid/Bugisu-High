import{r as d,j as r,m as h,a as p}from"./index-EH-KDdP-.js";import{A as x}from"./index-CAtil0is.js";import{C as u}from"./chevron-left-GT57DOTz.js";const m=({items:t})=>{const[i,o]=d.useState(0),s=()=>{o(n=>(n+1)%t.length)},l=()=>{o(n=>(n-1+t.length)%t.length)};return!t||t.length===0?null:r.jsxs("div",{className:"carousel-3d-container",children:[r.jsx("div",{className:"carousel-viewport",children:r.jsx(x,{mode:"popLayout",children:t.map((n,a)=>{let e="hidden";a===i?e="center":a===(i+1)%t.length?e="right":a===(i-1+t.length)%t.length&&(e="left"),t.length===2&&e==="left"&&(e="hidden");const c={center:{x:0,scale:1,zIndex:10,opacity:1,rotateY:0,filter:"brightness(1)",transition:{type:"spring",stiffness:300,damping:30}},left:{x:"-15%",scale:.85,zIndex:5,opacity:.7,rotateY:15,filter:"brightness(0.7) blur(1px)",transition:{duration:.4}},right:{x:"15%",scale:.85,zIndex:5,opacity:.7,rotateY:-15,filter:"brightness(0.7) blur(1px)",transition:{duration:.4}},hidden:{x:0,scale:.5,zIndex:0,opacity:0,transition:{duration:.2}}};return e==="hidden"&&t.length>3?null:r.jsx(h.div,{variants:c,initial:"hidden",animate:e,className:"carousel-card-wrapper",style:{position:e==="center"?"relative":"absolute",top:e==="center"?0:"50%",translateY:e==="center"?0:"-50%",left:e==="center"?0:e==="left"?"0":"auto",right:e==="right"?"0":"auto",marginLeft:e==="center"?"auto":0,marginRight:e==="center"?"auto":0,width:"100%"},children:n},a)})})}),t.length>1&&r.jsxs("div",{className:"carousel-controls",children:[r.jsx("button",{onClick:l,className:"control-btn","aria-label":"Previous",children:r.jsx(u,{size:24})}),r.jsx("div",{className:"carousel-dots",children:t.map((n,a)=>r.jsx("button",{onClick:()=>o(a),className:`dot ${a===i?"active":""}`,"aria-label":`Go to slide ${a+1}`},a))}),r.jsx("button",{onClick:s,className:"control-btn","aria-label":"Next",children:r.jsx(p,{size:24})})]}),r.jsx("style",{children:`
                .carousel-3d-container {
                    width: 100%;
                    max-width: 500px; /* Limit width specifically for mobile/tablet */
                    margin: 0 auto;
                    perspective: 1000px; /* Essential for 3D effect */
                    padding: 2rem 0;
                    overflow: visible; /* Allow shadows/tilts to spill slightly */
                }

                .carousel-viewport {
                    position: relative;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 450px; /* Fixed height to accommodate cards */
                }

                .carousel-card-wrapper {
                    width: 100%;
                    max-width: 320px; /* Standard card width */
                    backface-visibility: hidden;
                    transform-style: preserve-3d;
                }

                /* Ensure inner card fits */
                .carousel-card-wrapper > div {
                    height: 100%;
                    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.3) !important; /* Enhanced shadow for 3D feel */
                }

                .carousel-controls {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 1rem;
                    padding: 0 1rem;
                }

                .control-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: white;
                    border: 1px solid #e2e8f0;
                    color: #0f172a;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                    transition: all 0.2s;
                    z-index: 20;
                }

                .control-btn:active {
                    transform: scale(0.95);
                    background: #f1f5f9;
                }

                .carousel-dots {
                    display: flex;
                    gap: 8px;
                }

                .dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #cbd5e1;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .dot.active {
                    background: #dc2626;
                    transform: scale(1.2);
                    width: 24px; /* Pill shape for active */
                    border-radius: 4px;
                }
            `})]})};export{m as T};
