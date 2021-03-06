# Simplecov Report

A GitHub Action that report simplecov coverage.

Dynamically updating gif format:
<img src="https://gist.githubusercontent.com/Wittiest/28438e6422c99dcb2baf3f40cc430ba4/raw/coverage.svg"/>

Pull Request comment format:

![Demo](https://i.gyazo.com/c4e572c91fe8048c95392ea3ddce79f5.png)


## Usage:

The action works only with `pull_request` event.

### Inputs

- `token` - The GITHUB_TOKEN secret.
- `failedThreshold` - Failed threshold. (default: `20`)
- `postPullRequestComment` - boolean
- `svgPath` - Path location to write svg to
- `resultPath` - Path to last_run json file. (default: `.coverage.json`)

## Example

```yaml
name: Tests
on:
  pull_request:

jobs:
  build:
    steps:
      - name: Test
        run: bundle exec rspec

      - name: Simplecov Report
        uses: nutrisense/simplecov-report-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```
