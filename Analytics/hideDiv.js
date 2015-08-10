function toutAfficher(){
    document.getElementById('uniqueVideo').style.display = 'block';
    document.getElementById('allVideos').style.display = 'block';
}

function toggleView(view){
    var otherView = view == 'uniqueVideo' ? 'allVideos' : 'uniqueVideo';
    var divOtherView = document.getElementById(otherView);
    var divView = document.getElementById(view);

    divView.style.display = 'block';
    divOtherView.style.display = 'none';
}