# MD to PDF Converter

This is a simple browser based tool to convert markdown to PDF. You can control how the PDF looks
by tweaking the available styling options. A simple tool like this should not be behind a paywall

## Available styling options

| Option | Description | Default |
| --- | --- | --- |
| `font-family` | Select the font family to use | `Arial` |
| `font-size` | Adjust the font size to be used in the PDF | `16px` |
| `page-size` | Select the page size of the PDF | `A4` |
| `margin` | Set the margin of the PDF | `1cm` |
| `<page-break>` | A special HTML tag to force a page break in the PDF | |

> Note: The `<page-break>` needs to be used as a standalone tag in the markdown file
> to force a page break in the PDF. Just place `<page-break>` in a new line to force a page break at
> that point in the PDF.
