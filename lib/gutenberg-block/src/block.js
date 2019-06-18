/**
 * Block dependencies (npm packages).
 */
import classnames from 'classnames';

/**
 * WordPress block libraries.
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { createElement } = wp.element;
const {
	RichText,
	InspectorControls,
	BlockControls,
	URLInput,
	URLInputButton,
} = wp.editor;
const {
	PanelBody,
	// TextareaControl,
	TextControl,
	Dashicon,
	Toolbar,
	Button,
	Tooltip,
	ToggleControl,
	SelectControl,
	ServerSideRender,
} = wp.components;
const {
	apiFetch,
} = wp;
const {
	addQueryArgs,
} = wp.url;

/**
 * Internal dependencies.
 */
import InsertPageButton from './button';

/**
 * Register Insert Pages block.
 */
export default registerBlockType( 'insert-pages/block', {
	title: __( 'Insert Page', 'insert-page' ),
	description: __( 'Insert a page, post, or custom post type.', 'insert-page' ),
	category: 'widgets',
	icon: 'media-default',
	keywords: [
		__( 'insert', 'insert-page' ),
		__( 'embed', 'insert-page' ),
		__( 'shortcode', 'insert-page' ),
	],
	attributes: {
		url: {
			type: 'string',
			default: '',
		},
		page: {
			type: 'number',
			default: 0,
		},
		display: {
			type: 'string',
			default: 'title',
		},
		class: {
			type: 'string',
			default: '',
		},
		id: {
			type: 'string',
			default: '',
		},
		inline: {
			type: 'bool',
			default: false,
		},
		public: {
			type: 'bool',
			default: false,
		},
		querystring: {
			type: 'string',
		},
	},
	edit: props => {
		const onChangeLink = ( url, post ) => {
			props.setAttributes( {
				url: url,
				page: (post && post.id ) || 0,
			} );
		};

		return [
			props.attributes.page > 0 ? (
				<ServerSideRender
					block="insert-pages/block"
					attributes={ props.attributes }
				/>
			) : (
				<h2>{ __( 'Choose a page to insert.', 'insert-page' ) }</h2>
			),
			!! props.isSelected && (
				<BlockControls key="controls">
					<Toolbar
						className="components-toolbar"
					>
						<InsertPageButton
							url={ props.attributes.url }
							onChange={ onChangeLink }
						/>
					</Toolbar>
				</BlockControls>
			),
			!! props.isSelected && (
				<InspectorControls key="inspector">
					<PanelBody title={ __( 'Insert Page', 'insert-page' ) }>
						<URLInput
							value={ props.attributes.url }
							onChange={ onChangeLink }
							autoFocus={ false }
							className="width-100"
						/>
					</PanelBody>
					<PanelBody title={ __( 'Settings', 'insert-page' ) }>
						<SelectControl
							label={ __( 'Display', 'insert-page' ) }
							value={ props.attributes.display }
							options={ [
								{ label: __( 'Title', 'insert-page' ), value: 'title' },
								{ label: __( 'Link', 'insert-page' ), value: 'link' },
								{ label: __( 'Excerpt with title', 'insert-page' ), value: 'excerpt' },
								{ label: __( 'Excerpt only (no title)', 'insert-page' ), value: 'excerpt-only' },
								{ label: __( 'Content', 'insert-page' ), value: 'content' },
								{ label: __( 'Post Thumbnail', 'insert-page' ), value: 'post-thumbnail' },
								{ label: __( 'All (includes custom fields)', 'insert-page' ), value: 'all' },
							] }
							onChange={ value => props.setAttributes( { display: value } ) }
						/>
						<TextControl
							label={ __( 'Custom CSS Class', 'insert-page' ) }
							value={ props.attributes.class }
							onChange={ value => props.setAttributes( { class: value } ) }
						/>
						<TextControl
							label={ __( 'Custom Element ID', 'insert-page' ) }
							value={ props.attributes.id }
							onChange={ value => props.setAttributes( { id: value } ) }
						/>
						<TextControl
							label={ __( 'Custom Querystring', 'insert-page' ) }
							value={ props.attributes.querystring }
							onChange={ value => props.setAttributes( { querystring: value } ) }
						/>
						<ToggleControl
							label={ __( 'Inline?', 'insert-page' ) }
							help={ props.attributes.inline ? __( 'Inserted page rendered in a <span>', 'insert-page' ) : __( 'Inserted page rendered in a <div>', 'insert-page' ) }
							checked={ props.attributes.inline }
							onChange={ value => props.setAttributes( { inline: value } ) }
						/>
						<ToggleControl
							label={ __( 'Reveal Private Pages?', 'insert-page' ) }
							help={ props.attributes.public ? __( 'Anonymous users can see this inserted even if its status is private', 'insert-page' ) : __( 'If this page is private, only users with permission can see it', 'insert-page' ) }
							checked={ props.attributes.public }
							onChange={ value => props.setAttributes( { public: value } ) }
						/>
					</PanelBody>
				</InspectorControls>
			),
		];
	},
	save: props => {
		// Rendering done server-side in block_render_callback().
		return null;
	},
} );