import React, { Component } from 'react';
import { connect } from 'react-redux';
import FeedListEntryLikes from './FeedListEntryLikes.jsx';
import FeedListEntryComments from './FeedListEntryComments.jsx';
import axios from 'axios';

const mapStateToProps = (state) => {
	//state.SOMETHING is the reducer
	//so you need another . to access its properties
	return {
		comments: state.postReducer.comments,
		user: state.userReducer.user
	}
}

const mapDispathToProps = (dispatch) => {
	return {
		newComment(comment) {
			dispatch({
				type: 'NEW_COMMENT',
				payload: comment
			})
		}
	}
}

class FeedListEntry extends Component {
	constructor(props) {
		super(props);
		this.state = {
			comments: [],
			currentComment:[],
			commentText: '',
			name: '',
			imageLink: ''
		}
		this.handleCommentInput = this.handleCommentInput.bind(this);
		this.submitComment = this.submitComment.bind(this);
	}

	componentDidMount() {
		//get name and image links
		let id = this.props.post.userId;
		axios.get(`api/user/getUserById?id=${id}`)
		.then( (data) => {
			this.setState({name: data.data.nickname});
			this.setState({imageLink: data.data.profilePicture});
		})
		.catch(err => {
			console.log(err, 'could not get data');
		})

		//get comments
		let postId = this.props.post.id;
		axios.get(`api/usercomment/getAllCommentForPost?postId=${postId}`)
		.then( (data) => {
			this.setState({comments: data.data.sort( (a,b) => {
				a = a.updatedAt;
				b = b.updatedAt;
				return a < b ? -1 : a > b ? 1 : 0;
			})});
		})
		.catch(err => {
			console.log(err, 'could not get data');
		})
	}

	handleCommentInput(input) {
		let text = input.target.value;
		this.setState({ commentText: text });
	}

	submitComment() {
		console.log('comment button is clicked')
		this.setState({currentComment: this.state.currentComment.concat([{
			userComment: this.state.commentText,
			postId: this.props.post.id,
			userId: this.props.user.id
		}])})

		//should send comment request to server
		let email = this.props.user.email;
		let ID = this.props.post.id;
		console.log(email, ID, this.state.commentText)
		axios.post('api/usercomment/postComment', {
			email: email,
			postId: ID,
			message: this.state.commentText
		})
		.then(data => {
			console.log(data);
		})
		.catch(err => {
			console.log('comment did not go through');
		})
	}

	render() {
		return (
			<div className="feed-entry">
				<div>
					<div className="post-info">
						<img src={this.state.imageLink} className="user-img" />
						<div className="vertical-center">
							<div>{this.state.name}</div>
							<div>{this.props.post.message}</div>
							<div className="post-time">{this.props.post.createdAt}</div>
						</div>
					</div>
				</div>

				<div className="like-section">
					<FeedListEntryLikes post={this.props.post} user={this.props.user}/>
				</div>
				<div className="comment-section">
					<ul>
						{this.state.comments.map((comment, key) =>
						<FeedListEntryComments comment={comment} key={key} user={this.props.user}/>)}   
					</ul>  
					<ul>
						{this.state.currentComment.map((comment, key) =>
						<FeedListEntryComments comment={comment} key={key} user={this.props.user}/>)}   
					</ul>  
					<div>
						<form>
							<textarea onChange={(input) => this.handleCommentInput(input)} cols="30" rows="4" name="comment"></textarea>
							<div>
								<button type="button" onClick={this.submitComment}>Comment</button>
							</div>
						</form>
					</div> 
				</div>
			</div>
		)
	}
}

export default FeedListEntry;