export const THEMES = [
  null,
  { name: 'Classic', background: '#0a0a0a', grid: '#1a1a1a', snakeHead: '#00ff44', snakeBody: '#00cc33', snakeGlow: '#00ff44', food: '#ff3344', foodHighlight: '#ff6677', foodGlow: '#ff3344' },
  { name: 'Neon City', background: '#0a0015', grid: '#1a0a2e', snakeHead: '#00ffff', snakeBody: '#00bbcc', snakeGlow: '#00ffff', food: '#ffaa00', foodHighlight: '#ffcc44', foodGlow: '#ffaa00' },
  { name: 'Toxic Swamp', background: '#0a1005', grid: '#1a2a10', snakeHead: '#aaff00', snakeBody: '#77cc00', snakeGlow: '#aaff00', food: '#ff44aa', foodHighlight: '#ff77cc', foodGlow: '#ff44aa' },
  { name: 'Deep Space', background: '#050510', grid: '#151530', snakeHead: '#aa44ff', snakeBody: '#7722cc', snakeGlow: '#aa44ff', food: '#ff6600', foodHighlight: '#ff8844', foodGlow: '#ff6600' },
  { name: 'Lava Core', background: '#100500', grid: '#2a1000', snakeHead: '#ff4400', snakeBody: '#cc3300', snakeGlow: '#ff4400', food: '#00ddff', foodHighlight: '#44eeff', foodGlow: '#00ddff' },
];

export function getTheme(level) {
  return THEMES[((level - 1) % 5) + 1] || THEMES[1];
}
