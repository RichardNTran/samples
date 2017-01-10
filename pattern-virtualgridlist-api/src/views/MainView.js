import Button from '@enact/moonstone/Button';
import {GridListImageItem, VirtualGridList} from '@enact/moonstone/VirtualList';
import {Header} from '@enact/moonstone/Panels';
import IconButton from '@enact/moonstone/IconButton';
import React from 'react';
import ri from '@enact/ui/resolution';

import AppStateDecorator from './AppStateDecorator';
import SideBar from '../components/SideBar';

import css from './MainView.less';

const albums = ['Family', 'Video', 'Travel'];

class MainView extends React.Component {
	showOverlay = false
	currentAlbum = albums[0]

	addItem = () => {
		const item = this.createMockItem(this.currentAlbum);
		this.props.addItem(item);
	}

	showSelectionOverlayHandler = () => {
		this.showOverlay = !this.showOverlay;
		this.props.selectionEnable();
	}

	onChange = (ev) => {
		const album = ev.value;
		this.currentAlbum = album;
		this.props.onChangeAlbum(album);
		this.scrollTo({index: 0, animate: false});
	}

	onClickItem = (index) => () => {
		this.props.toggleItem(index);
	}

	createMockItem = (album) => {
		const
			dataLength = this.props.data.length,
			title = (dataLength % 8 === 0) ? ' with long title' : '',
			subTitle = (dataLength % 8 === 0) ? 'Lorem ipsum dolor sit amet' : 'Subtitle',
			color = Math.floor((Math.random() * (0x1000000 - 0x101010)) + 0x101010).toString(16);

		return {
			selected: false,
			text: album + ' ' + dataLength + title,
			subText: subTitle,
			url: 'http://placehold.it/300x300/' + color + '/ffffff&text=Image ' + dataLength,
			bgColor: '#' + color,
			selectionEnable: this.showOverlay
		}
	}

	renderItem = ({index, key}) => {
		const item = this.props.data[index];

		return (
			<GridListImageItem
				key={key}
				caption={item.text}
				source={item.url}
				subCaption={item.subText}
				selected={item.selected}
				selectionOverlayShowing={item.selectionEnable}
				onClick={this.onClickItem(index)}
				className={css.gridListItem}
			/>
		);
	}

	getScrollTo = (scrollTo) => {
		this.scrollTo = scrollTo;
	}

	componentDidMount () {
		//focusOnIndex, setInitialFocusIndex, scrollToItem
		this.scrollTo({index: 60, animate: false});
	}

	render = () => {
		const
			deleteButton = this.showOverlay ? <Button onClick={this.props.deleteItem}>Delete</Button> : null,
			seleteAllButton = this.showOverlay ? <Button onClick={this.props.selectAll}>Select All</Button> : null,
			showPreviousButton = this.showOverlay ? <IconButton tooltipPosition='above' tooltipText='Go To Previous' onClick={this.showSelectionOverlayHandler}>rollbackward</IconButton> : null,
			selectionButton = !this.showOverlay ? <IconButton tooltipPosition='above' tooltipText='Selection' onClick={this.showSelectionOverlayHandler}>star</IconButton> : null,
			addButton = !this.showOverlay ? <IconButton tooltipText='Add Item' onClick={this.addItem}>plus</IconButton> : null;

		return (
			<div>
				<Header title='My Gallery'>
					{addButton}
					{selectionButton}
					{deleteButton}
					{seleteAllButton}
					{showPreviousButton}
				</Header>
				<div className={css.body}>
					<SideBar
						albums={albums}
						onAlbumChange={this.onChange}
						selectedAlbum={this.currentAlbum}
					/>
					<VirtualGridList
						cbScrollTo={this.getScrollTo}
						data={this.props.data}
						dataSize={this.props.data.length}
						itemSize={{minWidth: ri.scale(180), minHeight: ri.scale(270)}}
						spacing={ri.scale(20)}
						className={css.content}
						component={this.renderItem}
					/>
				</div>
			</div>
		);
	}
}

export default AppStateDecorator(MainView);
