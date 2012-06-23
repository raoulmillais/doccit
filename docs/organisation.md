Organisation Documentation
==========================

Generates a catalogue / index of our open source projects.

* Pull all public projects in from github API to generate an index
* It must be opt-in.  We could check for doccit enabled projects by looking for
the doccitrc file in the root of all public projects, but it may be preferable
just to check for a gh-pages branch as that would not tie people unnecesarily
to this tool.
* Spit out classes for different project programming languages to enable styling.
* Do all the same markdown static site generation as the project specific
functionality.
* Should this belong in doccit or should it be a different utility?
