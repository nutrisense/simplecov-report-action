import * as core from '@actions/core'
import * as github from '@actions/github'
import replaceComment from '@aki77/actions-replace-comment'
import markdownTable from 'markdown-table'
import {Result, GroupCoverageResult} from './main'

export async function report(result: Result, minCoverage: number): Promise<void> {
  const summaryTable = markdownTable([
    ['Total Files', 'Total Lines', 'Total Covered Lines', 'Total Covered Percentage', 'Minimum Coverage'],
    [
      `${result.total_files}`,
      `${result.total_covered_lines}`,
      `${result.total_lines}`,
      `${result.total_covered_percent.toPrecision(2)}%`,
      `${minCoverage}%`
    ]
  ])

  const groupHeaders = ['Group', 'Lines', 'Covered Lines', 'Coverage']

  const groupFormattedRows = result.groups.map(
    ({group_name, lines, covered_lines, covered_percent}: GroupCoverageResult) => [
      `${group_name}`,
      `${covered_lines}`,
      `${lines}`,
      `${covered_percent.toPrecision(2)}%`
    ]
  )

  const groupTable = markdownTable([groupHeaders, ...groupFormattedRows])

  const pullRequestId = github.context.issue.number
  if (!pullRequestId) {
    throw new Error('Cannot find the PR id.')
  }

  await replaceComment({
    token: core.getInput('token', {required: true}),
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: pullRequestId,
    body: `## Coverage Report\n${groupTable}\n\n${summaryTable}`
  })
}
