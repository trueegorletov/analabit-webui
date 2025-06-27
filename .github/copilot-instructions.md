Use Context7 mcp server to query documentations for used libraries and frameworks always when possible.
Use playwright to test the code in the browser and took screenshots with it whenever you want or have to check the UI or web page look. Use Firefox as the preferred browser by setting browserType to "firefox".
if the task is related to UI or web page responsiveness, use playwright to test carefully the look with different height and width in parameters (according to device breakpoints) of Playwright_navigate. Use these standard viewport sizes:
- Desktop: 1920x1080
- Tablet: 768x1024  
- Mobile: 375x667
ALWAYS close the browser with playwright_close after EVERY screenshot is taken to ensure proper viewport resizing functionality. Without closing the browser, subsequent navigations with different viewport sizes will not trigger responsive CSS media queries correctly.
When you need additional debug information, use Playwright_console_logs to get console logs from the browser.
Feel free to use another playwright tools and parameters if you think they are necessary for the task or the debugging process.
Use fetch whenever you need to get contents from a URL, for example, when a specific doc page is mentioned in the task.
Think intensively about the actions you are going to take, and if you are not sure about something, ask for clarification.
Use planning before starting to tackle bigger and complex tasks, and break them down into smaller steps.
When you need to use a library or framework, check if it is already installed in the project and use it accordingly.
Feel free to include additional libraries or frameworks if they are necessary for the task and not already present in the project.

IMPORTANT: Browser Management for Responsive Testing
When testing responsive design or taking screenshots at different viewport sizes, ALWAYS use playwright_close after each screenshot or any playwright operation that involves viewport resizing. Use Firefox as the preferred browser (browserType: "firefox"). Use these standard viewport breakpoints:
- Desktop: 1920x1080 (width x height)
- Tablet: 768x1024 (width x height)
- Mobile: 375x667 (width x height)

This ensures that:
- CSS media queries are properly triggered on fresh browser instances
- Viewport dimensions are correctly applied from the start
- Responsive design testing is accurate and reliable
- No viewport state is carried over between tests

The workflow should always be: navigate (firefox, specific viewport) → screenshot → close → navigate (firefox, new viewport) → screenshot → close