const firebaseConfig = {
    apiKey: "AIzaSyAoiOTZorTRLAwhpvjZwUaayrK5U6dFR6E",
    authDomain: "testgit-3bafb.firebaseapp.com",
    databaseURL: "https://testgit-3bafb.firebaseio.com",
    projectId: "testgit-3bafb",
    storageBucket: "testgit-3bafb.appspot.com",
    messagingSenderId: "260632016587",
    appId: "1:260632016587:web:e23b4b48af8a1affcfcd4e",
    measurementId: "G-1JZY4NX6QZ"
  };
let accessToken = localStorage.getItem('gitToken') || '';
  
document.querySelector('#logout').addEventListener('click', () => {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
});
 
  async function getData(service) {
    issues = await service.fetchIssues();
    const issuesDom = document.querySelector('#issues');
    issues.forEach(async (issue, id) => {
      const newIssueDom = document.createElement('li');
      const parsedString = issue.body.replace(/\!\[image\]\((.*?)\)/g, '<img src="$1">');
      newIssueDom.innerHTML = `<b>${id} ${issue.title}</b>
      <p>${parsedString}</p>`;
      issuesDom.appendChild(newIssueDom);
      if (issue.comments > 0) {
        const issueCommentsDom = document.createElement('ul');
        newIssueDom.appendChild(issueCommentsDom);  
        const comments = await service.fetchIssueComments(issue);
        comments.forEach(comment => {
          const newComment = document.createElement('li');
          newComment.innerHTML = comment.body;
          issueCommentsDom.appendChild(newComment);
        });
      }
      const formDom = document.createElement('form');
      formDom.innerHTML = '<input type=text name=comment><input type=submit>';
      formDom.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const comment = (new FormData(formDom)).get('comment');
        await service.addComment(issue, comment);
        issuesDom.innerHTML = '';
        getData(service);
      });
      newIssueDom.appendChild(formDom);
    });
  };

 // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const provider = new firebase.auth.GithubAuthProvider();
  provider.addScope('repo');

  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    console.log(result);
    accessToken = result.credential.accessToken;
    console.log(accessToken);
    localStorage.setItem('gitToken', accessToken);
    service = new GitService('toliankir', 'Onix-Front-End', accessToken);
    getData(service);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });

