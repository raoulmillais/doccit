Doccit
======

A tool to autogenerate documentation for github pages from markdown and code
documentation generators.  The aim is to make it stupidly easy to have docs
autogenerated from code repositories by adding a config file and a teamcity
build.

The markdown files in master should reflect docs in progress.  We should trigger
the documentation push to run when master is tagged (i.e. the project is released)

As a proof of concept I will get it working with my nodejs projects which already
have markdown docs and docco generated code documentation.  It should be easily
extensible to other projects so the c# wrapper seems sensible next.

Rationale
---------

It should be stupidly simple and runnable from teamcity.  I really don't want to
add this into the rake scripts. I've had a look at a bunch of static
site generators (including jekyll, wheat and docpad) but they all seem to chuck
in the kitchen sink.  We don't need multiple layouts, multiple parsing engines,
bundled http server, sitemaps or any of that stuff.

Configuration
-------------

Everything should be configurable with sensible defaults and conventions, which
as far as possible mimic the behaviours of github wiki documentation. Configuration
options should be read in the following order (lowest priority first):
1. Default configuration file in the doccit repo.
2. Per-project configuration file in the root of the project repo.
3. Command line arguments to the tool.

Project Specififc Documentation
-------------------------------

* Locate markdown documents in a configurable set of search paths within the
master branch. (Default to './docs')
* Generate Github Pages Documentation From Markdown using the same processor as
github.
 * Github uses their own [redcarpet](https://github.com/tanoku/redcarpet) ruby
 gem which binds to [sundown](https://github.com/tanoku/sundown) for markdown
 rendering.
 * There are also node bindings: [robotskirt](https://github.com/benmills/robotskirt)
* Ensure relative links between markdown files are preserved in the rendered
html.
 * I.E. We'll need to change the file extensions of local hrefs from md to html.
* Configurable layout html and css
* Inject the HTML rendered markdown into a configurable element by CSS selector
(Default: '#content') of a configurable layout html (Default: './layout.html')
 NOTE: I don't think these ought to live in the master branch of the relevant projects
 if we want to keep consistency.  (Do we?) I guess pulling in an artefact from a separate
 repo/build would make sense as Leighton / whoever can make changes there and have
 them picked up on the next documentation build, and/or we can have changes in that
 build trigger a rebuild of the documentation for all projects (the last tag).
* Generate and format a changelog using git-shortlog (Configurable: on by default)
 * Default to look in the docs folder of a repository for markdown files
 * Run a user configurable command to generate code docs (e.g. docco / nocco)
 * Alternatively, specify paths to other generated or custom documentation, which
 can be pulled in as-is without further processing.
* Delete the input markdown files.
* Validate all absolute links return 200 OK and all relative links are validate
* Auto add, commit on the gh-pages branch and push to github.

*What about a navigation menu?*

Organisation Documentation
--------------------------

* Pull all public projects in from github API to generate an index
* It must be opt-in.  We could check for doccit enabled projects by looking for
the doccitrc file in the root of all public projects, but it may be preferable
just to check for a gh-pages branch as that would not tie people unnecesarily
to this tool.
* Spit out classes for different project programming languages to enable styling.
* Do all the same markdown static site generation as the project specific
functionality.

To Rebase or not to rebase
--------------------------

It's often [recommended](http://get.inject.io/n/XxsZ6RE7) to just rebase
the gh-pages branch off master. I don't want to do that as it would be preferable
for the gh-pages branch to have a log which reflects only commits to the branch
for release documentation.  I'd also like more flexibility in what gets included
in the branch.

Other Ideas
-----------

* Historical documentation navigation by tag.
* Use [this pull request](https://github.com/jashkenas/docco/pull/28) to apply
custom css to the docco generated nodejs docs.
* It might be nice to automate the fiddly clean way of setting up a gh-pages
branch.
* Read package.json for the license and autogenerate a license page.  Add a
config value to the doccitrc for non-nodejs projects.
* Configurable project logo path in the doccitrc for displaying in the index on
the organisation page.

Implementation Notes
--------------------

* It must be runnable from both linux and windows build agents, so that rules
out bash scripts, batch files, or Makefiles.
* It will presumably need some scratch / temp area for checking out the master
and gh-pages branches and comitting / pushing.  That path should be configurable.
* It will probably be written in nodejs or ruby as they have plenty of nice CLI
support libraries, git and github wrappers and it's easy to test and shell out
child processes.


References
----------

There's some nice scripts [here](http://oli.jp/2011/github-pages-workflow/)
[TJ Holwaychuk](http://github.com/visionmedia) uses Makefiles and rebasing
