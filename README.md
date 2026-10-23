# SuperDataman

The website for SuperDataman, Amir Vitman's data engineering and AI consulting practice.

It's a plain static site: HTML, CSS and a little JavaScript. There's no framework, no build step and no dependencies to install.

## Run it locally

From the repo root:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. Refresh the browser to see changes.

## Project structure

```
index.html          the whole page: content and markup
css/styles.css      all styling, including light and dark themes
js/main.js          sticky top bar and the contact form
site.webmanifest    app name and icons for "Add to Home Screen" on Android
assets/
  brand/            SuperDataman logos (light, dark, full, mark)
  icons/            favicon and home-screen icons, resized from brand/logo-mark.png
  clients/          client logos shown in the scrolling logo strip
  photos/           profile photo
```

## Common edits

- **Text and sections:** edit `index.html`. Sections are marked by `id`: `who`, `build`, `stack`, `work`, `ways`, `about`, `contact`.
- **Colors and fonts:** the design tokens are at the top of `css/styles.css` under `:root`, with dark-mode values right below.
- **Add a client logo:** put the file in `assets/clients/`, then add a `logo-cell` link in **both** `.set` blocks of the logo strip in `index.html`. The second copy makes the loop seamless. Use the `--h` style to tune the logo's height.

## Contact form

The form sends leads through [Web3Forms](https://web3forms.com), which emails each submission to Amir. The access key is `WEB3FORMS_KEY` at the top of `js/main.js`. It is meant to be public, because Web3Forms only sends to the inbox that registered it.

The free plan accepts submissions from a browser only, so testing with `curl` will be rejected. To test, submit the form from the page.

## Deployment

The site is hosted on Vercel and deploys automatically when changes are pushed to `main`. Vercel serves the repo root as-is, so `index.html` must stay at the root.
