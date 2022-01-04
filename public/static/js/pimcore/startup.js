pimcore.object.tags.wysiwyg.defaultEditorConfig = {
	toolbarGroups: [
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'editing' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		{ name: 'others', groups: [ 'others' ] },
		{ name: 'about', groups: [ 'about' ] }
	],
	stylesSet: [
		{ name: 'UL list-group', element: 'ul', attributes: { 'class': 'list-group list-group-line' } },
		{ name: 'LI list-group-item', element: 'li', attributes: { 'class': 'list-group-item' } },
		{ name: 'LI decorated', element: 'li', attributes: { 'class': 'decorated' } },
	],
	removeButtons: 'Templates,Save,NewPage,ExportPdf,Preview,Print,Scayt,Font,FontSize,TextColor,BGColor,ShowBlocks,Maximize,About,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CopyFormatting,Outdent,Indent,JustifyBlock,BidiLtr,BidiRtl,Language,Anchor,Flash,HorizontalRule,Smiley,SpecialChar,PageBreak'
};

