About
=====

A tool to autogenerate documentation for github pages from markdown and code
documentation generators.  

Rationale:  It should be stupidly simple and runnable from teamcity.  I've had
a look at a bunch of static site generators (including jekyll, wheat and docpad)
but they all seem to chuck in the kitchen sink.  We don't need multiple layouts,
multiple parsing engines, bundled http server, sitemaps or any of that stuff.

Project Specififc Documentation
-------------------------------

* Generate Github Pages Documentation From Markdown
* It should seamlessly support linking between markdown files which works both
in master branch and in the generated html docs
* Configurable layout and css
* Auto commit and push to github
* Configurable by doccit.rc file
 * Run a user configurable command to generate code docs
 * Configure paths to documentation

Organisation Documentation
--------------------------

* Pull all public projects in from github API to generate an index
* Check for doccit enabled projects
* Spit out classes for different languages
* Do all the same markdown static site generation as the project specific
functionality.

Other Ideas
-----------

Historical documentation navigation by tag.
Use [this pull request](https://github.com/jashkenas/docco/pull/28) to apply
custom css to the docco generated nodejs docs.
