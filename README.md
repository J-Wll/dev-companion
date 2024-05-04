<h1>Dev Companion is an organisational tool intended for developers.</h1>

![image (3)](https://github.com/J-Wll/dev-companion/assets/80954812/04b988e7-d858-46a2-ad20-1959737cf5f1)

Built in React and Electron, Dev-Companion has a modular, moveable and resizable interface with basic implementations of the following features:
- Todo-list
- Kanban board
- Reflective journal
- Notes
- Resources list
- Timers (Regular and Pomodoro)

React-Draggable and React-Quill are used for draggability and note-taking respectively. 

The program is still in a fairly early version. In testing it has been stable in terms of not crashing and not losing data.
The main weaknesses of the current version are styling, keyboard controls and performance (The program doesn't lag but uses more CPU than it should). 

When you first launch the program a default workspace will appear showing each module, if this is overwhelming, click the clear or create button on the left sidebar. Then you can build your own custom workspace.
<hr>
Windows installer is available under releases.

In theory, as an Electron program it should work on Linux and MacOS.

To build for another platform (Requires NodeJS):
- Download/clone the directory
- Open an administrator terminal and navigate to the directory
- Run 'npm i' to get dependencies
- Run 'npm build' and wait

To run the development version, follow the same steps but do 'npm run dev' instead of the last step.

Thanks for checking out my project.
