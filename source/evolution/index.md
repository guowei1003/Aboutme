---
title: 进化
layout: page
---

<div class="evolution-container">
  <div class="mission">
    <h2>🧬 AI 加持下的人类进化</h2>
    <p>记录人类与 AI 共生的每一步</p>
  </div>

  <div class="timeline">
    <div class="item">
      <span class="date">2024.01</span>
      <p>网站上线，确立进化主旨</p>
    </div>
    <div class="item">
      <span class="date">2024.02</span>
      <p>AI 工作流整合完成</p>
    </div>
    <div class="item">
      <span class="date">2024.03</span>
      <p>开始系统性记录 AI 学习历程</p>
    </div>
    <div class="item">
      <span class="date">未来</span>
      <p>持续进化中...</p>
    </div>
  </div>

  <div class="philosophy">
    <h3>🌟 进化理念</h3>
    <blockquote>
      "AI 不是替代人类，而是增强人类能力的工具。我们正站在人类历史上最重要的转折点之一。"
    </blockquote>
  </div>
</div>

<style>
.evolution-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

.mission {
  text-align: center;
  margin-bottom: 50px;
}

.mission h2 {
  color: #007bff;
  font-size: 2em;
  margin-bottom: 10px;
}

.mission p {
  color: #666;
  font-size: 1.1em;
}

.timeline {
  border-left: 2px solid #e0e0e0;
  padding-left: 30px;
  margin-bottom: 50px;
}

.item {
  margin-bottom: 30px;
  position: relative;
}

.item::before {
  content: '';
  position: absolute;
  left: -36px;
  top: 5px;
  width: 14px;
  height: 14px;
  background: #007bff;
  border-radius: 50%;
}

.date {
  font-weight: bold;
  color: #007bff;
  font-size: 1.1em;
}

.item p {
  margin-top: 5px;
  color: #333;
}

.philosophy {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  padding: 30px;
  border-radius: 10px;
}

.philosophy h3 {
  color: #007bff;
  margin-bottom: 15px;
}

.philosophy blockquote {
  font-style: italic;
  color: #555;
  border-left: 4px solid #007bff;
  padding-left: 15px;
  margin: 0;
}

@media (max-width: 600px) {
  .evolution-container {
    padding: 0 15px;
  }

  .mission h2 {
    font-size: 1.5em;
  }

  .timeline {
    padding-left: 20px;
  }

  .item::before {
    left: -26px;
    width: 10px;
    height: 10px;
  }
}
</style>
