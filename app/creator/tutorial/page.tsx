import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Video, Code2, Lightbulb, AlertCircle, CheckCircle2, FileText, Image, Table, List, Type } from 'lucide-react'

export default function CreatorTutorialPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">MDX Course Content Guide</h1>
        <p className="text-muted-foreground">
          Complete reference for creating rich, engaging course lessons using MDX and Markdown
        </p>
      </div>

      <Alert>
        <Lightbulb className="w-4 h-4" />
        <AlertDescription>
          MDX combines the simplicity of Markdown with the power of React components. Use plain markdown for text formatting and special components for interactive elements.
        </AlertDescription>
      </Alert>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Quick Start
          </CardTitle>
          <CardDescription>The basics you need to get started writing course content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">1. Create a New Lesson</h4>
            <p className="text-sm text-muted-foreground mb-2">Navigate to Dashboard → Create New Lesson</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">2. Write Your Content</h4>
            <p className="text-sm text-muted-foreground mb-2">Use the markdown editor with live preview to create your lesson</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">3. Assign to Course</h4>
            <p className="text-sm text-muted-foreground mb-2">Link your lesson to a course and set the lesson order</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">4. Publish</h4>
            <p className="text-sm text-muted-foreground">Set status to "published" to make it visible to students</p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Text Formatting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            Text Formatting
          </CardTitle>
          <CardDescription>Basic markdown formatting for text content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Markdown Syntax</h4>
              <div className="bg-muted p-3 rounded-md font-mono text-xs space-y-1">
                <div># Heading 1</div>
                <div>## Heading 2</div>
                <div>### Heading 3</div>
                <div className="mt-2">**Bold text**</div>
                <div>*Italic text*</div>
                <div>~~Strikethrough~~</div>
                <div className="mt-2">`inline code`</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Rendered Output</h4>
              <div className="bg-card border border-border p-3 rounded-md text-sm space-y-1">
                <h1 className="text-2xl font-bold">Heading 1</h1>
                <h2 className="text-xl font-bold">Heading 2</h2>
                <h3 className="text-lg font-bold">Heading 3</h3>
                <p><strong>Bold text</strong></p>
                <p><em>Italic text</em></p>
                <p><s>Strikethrough</s></p>
                <p><code className="bg-muted px-1 rounded">inline code</code></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lists */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="w-5 h-5" />
            Lists
          </CardTitle>
          <CardDescription>Organize content with bullet points and numbered lists</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Markdown</h4>
              <div className="bg-muted p-3 rounded-md font-mono text-xs space-y-1">
                <div>- Bullet point 1</div>
                <div>- Bullet point 2</div>
                <div>- Bullet point 3</div>
                <div className="mt-2">1. Numbered item 1</div>
                <div>2. Numbered item 2</div>
                <div>3. Numbered item 3</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Rendered</h4>
              <div className="bg-card border border-border p-3 rounded-md text-sm">
                <ul className="list-disc list-inside space-y-1">
                  <li>Bullet point 1</li>
                  <li>Bullet point 2</li>
                  <li>Bullet point 3</li>
                </ul>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>Numbered item 1</li>
                  <li>Numbered item 2</li>
                  <li>Numbered item 3</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Blocks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            Code Blocks
          </CardTitle>
          <CardDescription>Display code examples and technical content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Syntax</h4>
            <div className="bg-muted p-3 rounded-md font-mono text-xs">
              ```javascript<br />
              function greet(name) {"{"}<br />
              &nbsp;&nbsp;return `Hello, ${"{name}"}!`;<br />
              {"}"}<br />
```            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Rendered Output</h4>
            <div className="bg-card border border-border p-3 rounded-md">
              <pre className="bg-muted p-3 rounded text-xs font-mono overflow-x-auto">
                <code>{`function greet(name) {
  return \`Hello, \${name}!\`;
}`}</code>
              </pre>
            </div>
          </div>
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="text-xs">
              Supported languages: javascript, typescript, python, css, html, bash, json, and more
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Links and Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Links & Images
          </CardTitle>
          <CardDescription>Add external resources and visual content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Badge variant="outline" className="mb-2">Links</Badge>
              <div className="bg-muted p-3 rounded-md font-mono text-xs mb-2">
                [Link text](https://example.com)
              </div>
              <p className="text-sm text-muted-foreground">Renders as: <a href="#" className="text-primary hover:underline">Link text</a></p>
            </div>
            <div>
              <Badge variant="outline" className="mb-2">Images</Badge>
              <div className="bg-muted p-3 rounded-md font-mono text-xs mb-2">
                ![Alt text](https://example.com/image.jpg)
              </div>
              <p className="text-sm text-muted-foreground">Use image URLs from your file storage or external CDNs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Embedding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Video Content
          </CardTitle>
          <CardDescription>Embed videos from YouTube, Vimeo, or custom sources</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">YouTube Embed</h4>
            <div className="bg-muted p-3 rounded-md font-mono text-xs">
              {`<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>`}
            </div>
          </div>
          <Alert>
            <Video className="w-4 h-4" />
            <AlertDescription className="text-xs">
              Videos make lessons more engaging. Consider adding a video introduction to each major topic.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Tables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table className="w-5 h-5" />
            Tables
          </CardTitle>
          <CardDescription>Organize structured data in tables</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Markdown Syntax</h4>
            <div className="bg-muted p-3 rounded-md font-mono text-xs">
              | Header 1 | Header 2 | Header 3 |<br />
              | -------- | -------- | -------- |<br />
              | Cell 1   | Cell 2   | Cell 3   |<br />
              | Cell 4   | Cell 5   | Cell 6   |
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Rendered Output</h4>
            <div className="bg-card border border-border p-3 rounded-md overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Header 1</th>
                    <th className="p-2 text-left">Header 2</th>
                    <th className="p-2 text-left">Header 3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Cell 1</td>
                    <td className="p-2">Cell 2</td>
                    <td className="p-2">Cell 3</td>
                  </tr>
                  <tr>
                    <td className="p-2">Cell 4</td>
                    <td className="p-2">Cell 5</td>
                    <td className="p-2">Cell 6</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blockquotes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Blockquotes & Callouts
          </CardTitle>
          <CardDescription>Highlight important information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Markdown</h4>
            <div className="bg-muted p-3 rounded-md font-mono text-xs">
              {'> This is a blockquote'}<br />
              {'> It can span multiple lines'}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Rendered</h4>
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
              This is a blockquote<br />
              It can span multiple lines
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Best Practices
          </CardTitle>
          <CardDescription>Tips for creating effective course content</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong>Start with learning objectives:</strong> Clearly state what students will learn at the beginning
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong>Break content into sections:</strong> Use headings to organize topics logically
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong>Include practical examples:</strong> Use code blocks and real-world scenarios
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong>Add visual content:</strong> Images and videos improve engagement and understanding
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong>End with a summary:</strong> Recap key points and link to additional resources
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong>Use the preview:</strong> Always check the preview before publishing
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Lesson Structure Template */}
      <Card className="bg-accent/50">
        <CardHeader>
          <CardTitle>Recommended Lesson Structure</CardTitle>
          <CardDescription>A proven template for effective course lessons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="bg-card p-3 rounded-md">
              <strong className="block mb-1">1. Introduction (2-3 minutes)</strong>
              <p className="text-muted-foreground text-xs">What students will learn and why it matters</p>
            </div>
            <div className="bg-card p-3 rounded-md">
              <strong className="block mb-1">2. Core Content (10-15 minutes)</strong>
              <p className="text-muted-foreground text-xs">Main teaching with examples and explanations</p>
            </div>
            <div className="bg-card p-3 rounded-md">
              <strong className="block mb-1">3. Practical Example (5-7 minutes)</strong>
              <p className="text-muted-foreground text-xs">Step-by-step walkthrough or case study</p>
            </div>
            <div className="bg-card p-3 rounded-md">
              <strong className="block mb-1">4. Summary (2 minutes)</strong>
              <p className="text-muted-foreground text-xs">Recap key points and next steps</p>
            </div>
            <div className="bg-card p-3 rounded-md">
              <strong className="block mb-1">5. Resources</strong>
              <p className="text-muted-foreground text-xs">Links to documentation, tools, and further reading</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Alert>
        <Lightbulb className="w-4 h-4" />
        <AlertDescription>
          Need help? Check the preview mode in the lesson editor to see exactly how your content will appear to students. The markdown editor provides real-time feedback as you write.
        </AlertDescription>
      </Alert>
    </div>
  )
}
