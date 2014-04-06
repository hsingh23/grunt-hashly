hashly
======

hashly is a build-time tool which enables cache-busting for static files (images, JavaScript, CSS, etc). 

hashly copies a directory structure containing static files, inserting an MD5 hash code (based on the contents of the file) into each filename. It creates a manifest file which contains a mapping between the original and hashed file names, which can be used in web applications to map canonical file names to their specific, hashed URL. This way, when a file's content changes, its URL changes; this forces CDN, proxies, and browsers to download the new file, even if they had an old version cached.

This is a particularly elegant solution which allows zero-downtime deployments, with backwards AND forwards compatibility between different versions of your web application and their corresponding static files. Filename-based cache busting is much more reliable than using other techniques (i.e. querystrings with version numbers, 304 HTTP codes), and allows you to cache aggressively without fear of not being able to update static files. 

Why hashly?
------------------
hashly is used as a build-time task to process static files. Once the processing is done, the output can be deployed to web servers (or CDNs, or Amazon S3, etc) over any existing files. Because when a file's content changes, its filename changes, you don't have to worry about backwards compatibility between releases. Existing filenames would be left alone, and only new content would be deployed.

Once static files are deployed, you would deploy your web application code, including the manifest file created by hashly, to your web application servers. When your application starts, it should load the manifest file, and begin constructing any URLs to static assets using the hashed filenames.

You should configure your CDN to set HTTP headers to force your content to be cached for as long as possible. 

Usage
------------------

```
usage: hashly [option option=parameter ...] <source> [destination]

If source is omitted, the current working directory will be used.
If destination is omitted, hashed files will be written alongside the source files.

options:
  -h, --help               Print help (this message) and exit.
  -v, --verbose            Emit verbose output
  -e, --exclude            A globbing expression. Any matching files will not be processed.
  -m, --manifest-format    The format for the manifest file. Currently supports "json" or "tab" (tab delimited). 
                           Default is "json"
  -i, --ignore             Ignore errors. Otherwise, hashly will abort on the first error.
```


Image sizes
------------------
hashly can also read the sizes of all image file formats (including jpeg, png, gif, bmp, tif, and webp) and add this data to the manifest file. This can be extremely useful for generating markup (server side) that contains image sizes. 

Here's a sample of the type of semantics you could enable in your favorite markup-generating server-side language:

```csharp
@Html.ImageWithSize("/images/banana.png")
```

which could generate the HTML, where the width and height are read from the hashly manifest file:

```html
<img src="/images/banana-hc9ad0a4ff563467fd235a2a23efab4702.png" width="400" height="300" />
```

If you want to get fancy, you could create a component that creates responsive images that can be 100% width, and use CSS to reserve their vertical space (avoiding the much hated screen jump when an image loads while you're in the middle of reading an article). This can be accomplished by calculating the aspect ratio of the image from the width/height in the hashly manifest file:

```css
/* Static CSS that makes responsive images work */
.responsive-image {
	width: 100%;
	position: relative;
	height: 0; /* The padding-bottom reserves the height of the image */
	overflow: hidden;
}

.responsive-image image {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
}
```

```html
<!-- The padding-bottom is generated server-side from width/height in the hashly manifest -->
<div class="responsive-image">
  <img src="/images/banana-hc9ad0a4ff563467fd235a2a23efab4702.png" style="padding-bottom: 75.25%;" />
</div>
```

Inspiration
------------------
Inspired by cache-busting techniques developed at Vistaprint, as well as by the Ruby on Rails Asset Pipeline.
