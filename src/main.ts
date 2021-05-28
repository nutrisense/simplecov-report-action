import path from 'path'
import * as core from '@actions/core'
import * as github from '@actions/github'
import {report} from './report'

export interface GroupCoverageResult {
  group_name: string
  lines: number
  covered_lines: number
  covered_percent: number
}

export interface Result {
  groups: GroupCoverageResult[]
  total_files: number
  total_covered_lines: number
  total_lines: number
  total_covered_percent: number
}

async function run(): Promise<void> {
  try {
    if (!github.context.issue.number) {
      core.warning('Cannot find the PR id.')
      return
    }

    const failedThreshold: number = Number.parseInt(core.getInput('failedThreshold'), 10)
    const resultPath: string = core.getInput('resultPath')
    const postPullRequestComment: boolean = JSON.parse(core.getInput('postPullRequestComment'))

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const result = require(path.resolve(process.env.GITHUB_WORKSPACE!, resultPath)) as Result

    await report(result, failedThreshold, postPullRequestComment)

    if (result.total_covered_percent < failedThreshold) {
      throw new Error(`Coverage is less than ${failedThreshold}%. (${result.total_covered_percent}%)`)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
