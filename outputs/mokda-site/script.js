const palette = ['#72e2c8','#4bb7d0','#f2ad68','#9bc9c4'];
document.querySelectorAll('.molecular-flow').forEach((canvas) => {
  const ctx = canvas.getContext('2d');
  const density = Number(canvas.dataset.density || 40);
  let nodes = [];
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, rect.width * ratio);
    canvas.height = Math.max(1, rect.height * ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);
    nodes = Array.from({length:density},(_,i)=>({
      x:Math.random()*rect.width,y:Math.random()*rect.height,
      vx:.28+Math.random()*.62,vy:(Math.random()-.5)*.48,
      r:i%6===0?3.2:1.9,c:palette[i%palette.length],phase:Math.random()*Math.PI*2
    }));
  };
  const draw = () => {
    const w=canvas.clientWidth,h=canvas.clientHeight;
    if(w&&h){
      ctx.clearRect(0,0,w,h);
      const t=performance.now()*.001;
      nodes.forEach(n=>{
        n.x+=n.vx;n.y+=n.vy+Math.sin(t*1.3+n.phase)*.18;
        if(n.x>w+12){n.x=-12;n.y=Math.random()*h;}
        if(n.y<0)n.y=h;if(n.y>h)n.y=0;
      });
      for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i],b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);
        if(d<145){ctx.strokeStyle=`rgba(114,226,200,${(1-d/145)*.46})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
      }
      nodes.forEach(n=>{
        ctx.globalAlpha=.92;ctx.shadowBlur=n.r>2?13:6;ctx.shadowColor=n.c;ctx.fillStyle=n.c;
        ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fill();
      });
      ctx.shadowBlur=0;ctx.globalAlpha=1;
    }
    requestAnimationFrame(draw);
  };
  new ResizeObserver(resize).observe(canvas); resize(); draw();
});

const capabilityData = {
  build:['复杂体系构建与可视化','复杂体系构建<br><em>与可视化</em>','Mokda 提供可视化建模环境，支持蛋白质、DNA、RNA、小分子及非标准残基等结构的查看、编辑、修复与组装。需要构建更复杂的体系时，也可以在界面中完成膜蛋白、核酸—蛋白复合物、ADC、环肽、金属配位等体系的组装，以及溶剂化、离子添加和膜体系构建。','生物分子体系、复杂体系、溶剂与膜体系、高分子体系'],
  simulate:['高性能分子动力学模拟','高性能分子<br><em>动力学模拟</em>','Mokda 将体系准备、模拟参数设置、任务运行、实时监控和结果分析整合在交互式环境中。模拟过程中，研究者可以同步查看能量、温度、压力等热力学量和分子运动轨迹，并对轨迹开展计算、统计与可视化分析。','模拟参数与约束设置、运行状态监控、轨迹分析、增强采样、反应分子动力学'],
  small:['小分子药物设计与优化','小分子药物<br><em>设计与优化</em>','围绕虚拟筛选与先导化合物优化，Mokda 集成分子对接、自由能计算、亲和力预测和 ADMET 预测工具。研究者可以分析和排序候选分子、查看结构并导出结果，为候选筛选和后续优化提供计算依据。','分子对接、FEP 自由能计算、亲和力预测、ADMET 预测、筛选结果分析'],
  large:['大分子药物设计与优化','大分子药物<br><em>设计与优化</em>','Mokda 集成生物分子复合物全原子结构预测、结合亲和力预测，以及蛋白质与多肽设计工具。研究者可以依据靶点结构和设计约束开展设计，并将生成结果衔接后续计算评估。','复合物结构预测、结合亲和力预测、蛋白质与多肽设计、设计结果筛选及后续计算']
};
document.querySelectorAll('.cap-tab').forEach((tab)=>tab.addEventListener('click',()=>{document.querySelectorAll('.cap-tab').forEach(x=>{x.classList.remove('active');x.setAttribute('aria-selected','false');});tab.classList.add('active');tab.setAttribute('aria-selected','true');const d=capabilityData[tab.dataset.cap];const panel=document.querySelector('.cap-panel');if(!panel)return;panel.classList.remove('panel-changing');void panel.offsetWidth;panel.classList.add('panel-changing');panel.querySelector('.cap-kicker').textContent=d[0];panel.querySelector('h2').innerHTML=d[1];panel.querySelector('.cap-description').textContent=d[2];panel.querySelector('.cap-show b').textContent=d[3];}));

document.querySelectorAll('.solution-mega article').forEach((card)=>card.addEventListener('pointermove',(event)=>{const rect=card.getBoundingClientRect();card.style.setProperty('--pointer-x',`${event.clientX-rect.left}px`);card.style.setProperty('--pointer-y',`${event.clientY-rect.top}px`);}));

const revealItems=document.querySelectorAll('.capability-layout,.solutions-heading,.solution-mega article,.cases-page .page-title,.case-list article,.resource-title,.resource-grid article,.updates-page .page-title,.update-empty');
if('IntersectionObserver' in window){const revealObserver=new IntersectionObserver((entries,observer)=>entries.forEach((entry)=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.12});revealItems.forEach((item,index)=>{item.classList.add('reveal-item');item.style.setProperty('--reveal-delay',`${(index%4)*90}ms`);revealObserver.observe(item);});}else{revealItems.forEach((item)=>item.classList.add('is-visible'));}

document.querySelector('.mobile-toggle')?.addEventListener('click',()=>{const nav=document.querySelector('.site-header nav');nav.classList.toggle('mobile-open');});
