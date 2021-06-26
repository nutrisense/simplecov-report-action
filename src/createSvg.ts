import {Result, GroupCoverageResult} from './main'
import {writeFileSync} from 'fs'

const W3_URL = 'http://www.w3.org/2000/svg'

const calculateBarColor = (percentage: number): string => {
  if (percentage < 20) return '#FF0000'
  if (percentage < 50) return '#F1E05A'
  return '#50C878'
}

const SVG_STYLES = `
  <style>
    .header {
      font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: #000;
    }
    .group-name {
      font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: #333
    }
  </style>
`

const generateSvgBar = (
  {group_name, lines, covered_lines, covered_percent}: GroupCoverageResult,
  idx: number
): string => {
  const yPos = Math.floor(idx / 2) * 40
  const xPos = idx % 2 ? 345 : 0
  const groupText = `${group_name}   |   ${covered_percent.toPrecision(2)}%   |   ${covered_lines}/${lines}`

  return `
    <g transform="translate(${xPos}, ${yPos})">
      <text x="2" y="15" class="group-name">${groupText}</text>
      <svg width="205" x="0" y="25">
        <rect rx="5" ry="5" x="0" y="0" width="205" height="8" fill="#ddd"/>
        <rect
          height="8"
          fill="${calculateBarColor(covered_percent)}"
          rx="5"
          ry="5"
          x="0"
          y="0"
          width="${covered_percent || 3}"
        />
      </svg>
    </g>
  `
}

const generateSvg = ({total_covered_lines, total_lines, total_covered_percent, groups}: Result): string => `
  <svg
    xmlns="${W3_URL}"
    width="600"
    height="${150 + (40 * groups.length) / 2}"
    viewBox="0 0 600 ${150 + (40 * groups.length) / 2}"
    fill="none"
  >
    ${SVG_STYLES}
    <rect x="0.5" y="0.5" rx="4.5" height="99%" stroke="#e4e2e2" width="599" fill="#fffefe" stroke-opacity="1" />
    <g transform="translate(300, 25)">
      <text x="0" y="0" class="header" alignment-baseline="middle" text-anchor="middle">Test Coverage</text>
    </g>
    <g transform="translate(0, 55)">
      <svg x="25">${groups.map(generateSvgBar).join('\n')}</svg>
    </g>
    <g transform="translate(25, ${80 + (groups.length * 40) / 2})">
      <rect rx="2" ry="2" width="550" height="2" fill="#000"/>
    </g>
    <g transform="translate(0, ${100 + (groups.length * 40) / 2})">
      <svg x="25">
        ${generateSvgBar(
          {
            group_name: 'Total',
            lines: total_lines,
            covered_lines: total_covered_lines,
            covered_percent: total_covered_percent
          },
          0
        )}
      </svg>
    </g>
  </svg>
`

export async function createSvg(result: Result, svgPath: string): Promise<void> {
  const graphic = generateSvg(result)

  try {
    writeFileSync(svgPath, graphic)
  } catch (err) {
    console.error(err)
  }
}
