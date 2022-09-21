/** CodeBox
  *
  * Code syntax highlighting tool for Editor.js
  *
  * @version 1.0.0
  * @created - 2020.02.12
  * @author - Adombang Munang Mbomndih (Bomdi) <dzedock@gmail.com> (https://bomdisoft.com)
  *
  * Version History
  * ---------------
  * @version 2.0.0 - 2022.09.06 - Use TypeScript - Adombang Munang Mbomndih
  */


//#region imports
// require('./codebox.css').toString();

//#endregion

const DEFAULT_THEMES = ['light', 'dark'];
const COMMON_LANGUAGES = {
  none: 'Auto-detect', apache: 'Apache', bash: 'Bash', cs: 'C#', cpp: 'C++', css: 'CSS', coffeescript: 'CoffeeScript', diff: 'Diff',
  go: 'Go', html: 'HTML, XML', http: 'HTTP', json: 'JSON', java: 'Java', javascript: 'JavaScript', kotlin: 'Kotlin',
  less: 'Less', lua: 'Lua', makefile: 'Makefile', markdown: 'Markdown', nginx: 'Nginx', objectivec: 'Objective-C',
  php: 'PHP', perl: 'Perl', properties: 'Properties', python: 'Python', ruby: 'Ruby', rust: 'Rust', scss: 'SCSS',
  sql: 'SQL', shell: 'Shell Session', swift: 'Swift', toml: 'TOML, also INI', typescript: 'TypeScript', yaml: 'YAML',
  plaintext: 'Plaintext'
};

class CodeBox {
  api: any;
  config: { themeName: any; themeURL: any; useDefaultTheme: any; };
  data: { code: any; language: any; theme: any; };
  highlightScriptID: string;
  highlightCSSID: string;
  codeArea: HTMLDivElement;
  selectInput: HTMLInputElement;
  selectDropIcon: HTMLElement;

  constructor({ data, api, config }: any){
    this.api = api;
    this.config = {
      themeName: config.themeName && typeof config.themeName === 'string' ? config.themeName : '',
      themeURL: config.themeURL && typeof config.themeURL === 'string' ? config.themeURL : '',
      useDefaultTheme: (config.useDefaultTheme && typeof config.useDefaultTheme === 'string'
        && DEFAULT_THEMES.includes(config.useDefaultTheme.toLowerCase())) ? config.useDefaultTheme : 'dark',
    };
    this.data = {
      code: data.code && typeof data.code === 'string' ? data.code : '',
      language: data.language && typeof data.language === 'string' ? data.language : 'Auto-detect',
      theme: data.theme && typeof data.theme === 'string' ? data.theme : this._getThemeURLFromConfig(),
    };
    this.highlightScriptID = 'highlightJSScriptElement';
    this.highlightCSSID = 'highlightJSCSSElement';
    this.codeArea = document.createElement('div');
    this.selectInput = document.createElement('input');
    this.selectDropIcon = document.createElement('i');

    this._injectHighlightJSScriptElement();
    this._injectHighlightJSCSSElement();

    this.api.listeners.on(window, 'click', this._closeAllLanguageSelects, true);
  }

  static get sanitize(){
    return {
      code: true,
      language: false,
      theme: false,
    }
  }

  static get toolbox() {
    return {
      title: 'CodeBox',
      icon: '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.71,6.29a1,1,0,0,0-1.42,0l-5,5a1,1,0,0,0,0,1.42l5,5a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L5.41,12l4.3-4.29A1,1,0,0,0,9.71,6.29Zm11,5-5-5a1,1,0,0,0-1.42,1.42L18.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l5-5A1,1,0,0,0,20.71,11.29Z"/></svg>'
    };
  }

  static get displayInToolbox() {
    return true;
  }

  static get enableLineBreaks() {
    return true;
  }

  render(){
    const codeAreaHolder = document.createElement('pre');
    const languageSelect = this._createLanguageSelectElement();

    codeAreaHolder.setAttribute('class', 'codeBoxHolder');
    this.codeArea.setAttribute('class', `codeBoxTextArea ${ this.config.useDefaultTheme } ${ this.data.language }`);
    this.codeArea.setAttribute('contenteditable', 'true');
    this.codeArea.innerHTML = this.data.code;
    this.api.listeners.on(this.codeArea, 'blur', (event: any) => this._highlightCodeArea(event), false);
    this.api.listeners.on(this.codeArea, 'paste', (event: any) => this._handleCodeAreaPaste(event), false);

    codeAreaHolder.appendChild(this.codeArea);
    codeAreaHolder.appendChild(languageSelect);

    return codeAreaHolder;
  }

  save(blockContent: any) {
    return Object.assign(this.data, { code: this.codeArea.innerText, theme: this._getThemeURLFromConfig() });
  }

  validate(savedData: any) {
    if (!savedData.code.trim()) return false;
    return true;
  }

  destroy(){
    this.api.listeners.off(window, 'click', this._closeAllLanguageSelects, true);
    this.api.listeners.off(this.codeArea, 'blur', (event: any) => this._highlightCodeArea(event), false);
    this.api.listeners.off(this.codeArea, 'paste', (event: any) => this._handleCodeAreaPaste(event), false);
    this.api.listeners.off(this.selectInput, 'click', (event: any) => this._handleSelectInputClick(event), false);
  }

  _createLanguageSelectElement(){
    const selectHolder = document.createElement('div');
    const selectPreview = document.createElement('div');
    const languages = Object.entries(COMMON_LANGUAGES);

    selectHolder.setAttribute('class', 'codeBoxSelectDiv');

    this.selectDropIcon.setAttribute('class', `codeBoxSelectDropIcon ${ this.config.useDefaultTheme }`);
    this.selectDropIcon.innerHTML = '&#8595;';
    this.selectInput.setAttribute('class', `codeBoxSelectInput ${ this.config.useDefaultTheme }`);
    this.selectInput.setAttribute('type', 'text');
    this.selectInput.setAttribute('readonly', 'true');
    this.selectInput.value = this.data.language;
    this.api.listeners.on(this.selectInput, 'click', (event: any) => this._handleSelectInputClick(event), false);

    selectPreview.setAttribute('class', 'codeBoxSelectPreview');

    languages.forEach(language => {
      const selectItem = document.createElement('p');
      selectItem.setAttribute('class', `codeBoxSelectItem ${ this.config.useDefaultTheme }`);
      selectItem.setAttribute('data-key', language[0]);
      selectItem.textContent = language[1];
      this.api.listeners.on(selectItem, 'click', (event: any) => this._handleSelectItemClick(event, language), false);

      selectPreview.appendChild(selectItem);
    });

    selectHolder.appendChild(this.selectDropIcon);
    selectHolder.appendChild(this.selectInput);
    selectHolder.appendChild(selectPreview);

    return selectHolder;
  }

  _highlightCodeArea(event: any){
    // @ts-expect-error
    window.hljs.highlightBlock(this.codeArea);
  }

  _handleCodeAreaPaste(event: any){
    event.stopPropagation();
  }

  _handleSelectInputClick(event: any){
    event.target.nextSibling.classList.toggle('codeBoxShow');
  }

  _handleSelectItemClick(event: any, language: any){
    event.target.parentNode.parentNode.querySelector('.codeBoxSelectInput').value = language[1];
    event.target.parentNode.classList.remove('codeBoxShow');
    this.codeArea.removeAttribute('class');
    this.data.language = language[0];
    this.codeArea.setAttribute('class', `codeBoxTextArea ${ this.config.useDefaultTheme } ${ this.data.language }`);
    // @ts-expect-error
    window.hljs.highlightBlock(this.codeArea);
  }

  _closeAllLanguageSelects(){
    const selectPreviews = document.querySelectorAll('.codeBoxSelectPreview');
    for (let i = 0, len = selectPreviews.length; i < len; i++) selectPreviews[i].classList.remove('codeBoxShow');
  }

  _injectHighlightJSScriptElement(){
    const highlightJSScriptElement = document.querySelector(`#${ this.highlightScriptID }`);
    const highlightJSScriptURL = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.18.1/build/highlight.min.js';
    if (!highlightJSScriptElement) {
      const script = document.createElement('script');
      const head = document.querySelector('head');
      script.setAttribute('src', highlightJSScriptURL);
      script.setAttribute('id', this.highlightScriptID);

      if (head) head.appendChild(script);
    }
    else highlightJSScriptElement.setAttribute('src', highlightJSScriptURL);
  }

  _injectHighlightJSCSSElement(){
    const highlightJSCSSElement = document.querySelector(`#${ this.highlightCSSID }`);
    let highlightJSCSSURL = this._getThemeURLFromConfig();
    if (!highlightJSCSSElement) {
      const link = document.createElement('link');
      const head = document.querySelector('head');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', highlightJSCSSURL);
      link.setAttribute('id', this.highlightCSSID);

      if (head) head.appendChild(link);
    }
    else highlightJSCSSElement.setAttribute('href', highlightJSCSSURL);
  }

  _getThemeURLFromConfig(){
    let themeURL = `https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.18.1/build/styles/atom-one-${ this.config.useDefaultTheme }.min.css`;

    if (this.config.themeName) themeURL = `https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.18.1/build/styles/${ this.config.themeName }.min.css`;
    if (this.config.themeURL) themeURL = this.config.themeURL;

    return themeURL;
  }
}


export default CodeBox;