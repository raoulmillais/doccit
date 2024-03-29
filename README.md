Doccit
======

A tool to autogenerate documentation for github pages from markdown in the master
branch and optionally any other static code documentation.

Rationale
---------

For our open source projects, It would improve our [image and respectability](http://blog.nodejitsu.com/understanding-open-source-branding)
if we at least have a splash page: ideally a prettified and branded readme.
Documentation is boring and tedious and it is easy to get out of sync between
releases or forgotten about entirely.  This is particularly problematic if there
are usage examples and master has diverged from the last tagged release.

This tool should encourage consistent and clear documentation by removing and
automating the tedium.  Most people are already using the readme and markdown
processing on github.  Having a single readme should be the only requirement for
using this tool. The aim of this tool is not to set policy or be prescriptive.

Beyond the readme, the tool should also facilitate and encourage more literate
documentation, whether that be usage examples, rationale, code docs, or whatever.
It should be able to detect and be configured to read in other pages and links
between markdown files and also prettify them and fix up the links.  Note that
the style and content of the documentation is entirely up to the individual
project owners and contributors.

Finally, if there are pregenerated code docs these should be included too.  I am
aware that is a subject that polarises people.  I personally like a literate
programming style (for JavaScript and other dynamic languages at least) so I'd
like the docs I've created for my nodejs projects to be included, but again
this should be opt-in.

Setup and Approach
------------------

The markdown files in master ought to reflect docs in progress.  We could trigger
the documentation generation from teamcity as part of a tagged release (i.e. a
new version of the project is released).

As a proof of concept I will get it working with my nodejs projects which already
have markdown docs and docco generated code documentation.  It should be easily
extensible to other projects so the c# wrapper seems sensible next.

* It should be stupidly simple to setup and opt into.
* It should be runnable from teamcity.
* I really don't want to dump yet more stuff into the rake scripts.
* I've had a look at a bunch of static site generators (including jekyll, wheat
and docpad) but they all seem to chuck in the kitchen sink.
 * We don't need multiple layouts, multiple parsing engines, bundled http
 server, sitemaps or any of that stuff.
* It must be runnable from both linux and windows build agents, so that rules
out bash scripts, batch files, or Makefiles.
* It will presumably need some scratch / temp area for checking out the master
and gh-pages branches and comitting / pushing.  That path should be configurable.

It will be written in nodejs, as there are plenty of nice CLI support libraries,
git and github wrappers and it's easy to test and shell out child processes and
I can write it quickly in JavaScript.

Doccit should provide a compiler-like interface to documentation generation.  It
will operate on multiple named resources (the documentation sources) to produce
several outputs which will be agglomerated into a final destination (sink). It
should read its configuration at startup and be highly sciptable.

Configuration
-------------

Everything should be configurable with sensible defaults and conventions, which
as far as possible mimic the behaviours of github wiki documentation. Configuration
options should be read in the following order (lowest priority first):

1. Default runcontrol file in the doccit repo. (Provides the defaults for
invoking doccit with no arguments and no project level configuration, this
should be symlinked to a system locaation for per-site configuration when
installing on a system)
2. Per-user configuration file in the home directory of the current user.
3. Environement variables.
4. Per-project configuration file in the root of the project repo.
5. In some cases there may be a duplicate config value in the project's own
package config (e.g. package.json or nuspec.)
6. Command line arguments to the tool.

Project Specific Documentation
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

Boilerplates
------------

* Semver versioning and release documentation with links.  We will need to specify
a version scheme in config to account for (at least) semver and semver-node.
* License documentation. Nuspec specifies a URL and since npm is json you may
specify a license property.  Alternatively a license may be specified in the
doccit config as a fallback.

Unresolved Questions
--------------------

* Can we retrieve markdown versions of licenses from an authoritave source on the
internet automatically?
* Should the order of precedence be when config can be come from package
specifications of the projects (i.e. npm, nuspec etc) be package first or doccit
config first?

Reporters
---------

* Standard CLI reporter with ANSI colors
* Teamcity progress reporter

Sources
-------

* Markdown parser and linker
* Child process (shell out to other application)
* Docco

Doccit also needs to know (and ideally control) where the output will be from a
source and which artefacts must be linked to in the navigation.

Outputs
-------

* Asset file (e.g. image or zip)
* Homepage (a special type of single file as doccit must name it index.html and
put it in the root of the final agglomerated output.
* Folder - can have index.html and a title and / or an array of paths and titles
within the folder to put in the navigation.

Destinations (Sinks)
--------------------

Once the sources have all been converted to outputs, doccit will agglomerate all
the outputs and send them to a destination sink.

* path - a folder on the filesystem
* zip - a zip file
* gh-pages - github pages (defer to [hub](https://github.com/defunkt/hub) or similar?)

To Rebase or not to rebase
--------------------------

It's often [recommended](http://get.inject.io/n/XxsZ6RE7) to just rebase
the gh-pages branch off master. I don't want to do that as it would be preferable
for the gh-pages branch to have a log which reflects only commits to the branch
for release documentation.  I'd also like more flexibility in what gets included
in the branch.

Other Ideas
-----------

* [Organisation page generator](docs/organisation.md)
* Historical documentation navigation by tag.
* Use [this pull request](https://github.com/jashkenas/docco/pull/28) to apply
custom css to the docco generated nodejs docs.
* It might be nice to automate the fiddly clean way of setting up a gh-pages
branch.
* Configurable project logo path in the doccitrc for displaying in the index on
the organisation page.

References
----------

* There's some nice scripts [here](http://oli.jp/2011/github-pages-workflow/)
* [TJ Holwaychuk](http://github.com/visionmedia) uses Makefiles and rebasing
