## 1. Introduction
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Sam4Sc is a migration assistant for Angular to SCAM (Single Angular Component Modules) and Standalone Components.

Migrating an Angular application to the SCAM model is a preparation for the final switch to Standalone Components.

Sam4Sc assists in both steps, whereas the migration from SCAM to Standalone Components is fully automatic.

The migration/generation of SCAMs is semi-automatic. The SCAMs a generated first. After that, the developer(s) must define the dependencies per SCAM manually.

## 2. Setup and Usage

To install Sam4Sc, execute
```bash
npm i -D @angular-architects/sam4sc
```

### 2.1. Generate SCAMs

```bash
npx ng generate @angular-architects/sam4sc:scam --dry-run
# make sure, everything looks alright
npx ng generate @angular-architects/sam4sc:scam
```

or alternatively,

```
npx ng generate @angular-architects/sam4sc:scam --project [projectName]
```

### 2.2. Show the progress report for the SCAM report

```bash
npx ng generate @angular-architects/sam4sc:report
```

SCAMs will have a JavaScript comment at the start of the file with a tag SAM4SC:SCAM. Remove those, if you have added the dependencies and that module will not show up in the progress report.

### 2.3. Migrate to Standalone Components (Beta)

```bash
npx ng generate @angular-architects/sam4sc:scam2sc
```

Please feel free to try it out and give feedback.

## 3. More information
- [Detailed Explanation of SCAM, by Lars Gyrup Brink Nielsen](https://dev.to/this-is-angular/angular-revisited-tree-shakable-components-and-optional-ngmodules-36d2)
- [RFC Standalone Components](https://github.com/angular/angular/discussions/43784)
- [Standalone Components and their Impact on Modularity, by Rainer Hahnekamp](https://www.rainerhahnekamp.com/en/angular-standalone-components-and-their-impact-on-modularity/)



[Angular Architects: Angular Content, Consultancy, Training](https://www.angulararchitects.io)

<img src="angular-architects.svg" style='width: 250px; height: auto'>


## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.rainerhahnekamp.com"><img src="https://avatars.githubusercontent.com/u/5721205?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rainer Hahnekamp</b></sub></a><br /><a href="https://github.com/rainerhahnekamp/sam4sc/commits?author=rainerhahnekamp" title="Code">💻</a></td>
    <td align="center"><a href="https://dev.to/layzee"><img src="https://avatars.githubusercontent.com/u/6364586?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lars Gyrup Brink Nielsen</b></sub></a><br /><a href="https://github.com/rainerhahnekamp/sam4sc/commits?author=LayZeeDK" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/hm2075"><img src="https://avatars.githubusercontent.com/u/53794682?v=4?s=100" width="100px;" alt=""/><br /><sub><b>hm2075</b></sub></a><br /><a href="https://github.com/rainerhahnekamp/sam4sc/issues?q=author%3Ahm2075" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
