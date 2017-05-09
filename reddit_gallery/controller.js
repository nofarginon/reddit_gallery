const gallery = angular.module('gallery', []);

gallery.controller('mainController',function($scope){
    $scope.sub = "";
    $scope.dissubmit=false;
    $scope.related=false;//hide options
    $scope.disprev=true;//disabled previous button
    $scope.disnxt=true;//disabled next button
    $scope.images = [];//images array
    $scope.prev=[];//prev_images
    $scope.next=[];//next_images
    $scope.options=[];//option_images

    $scope.reset = () => {//on click reset
    	/*console.log($scope.sub);*/
    	if($scope.images.length!==0) $scope.disprev=false;//if images not empty then show previous button
    	$scope.disnxt=true;//in reset there is no next gallery just previous
    	$scope.related=false;//hide options
    	$scope.prev=[];//empty previous array
    	$scope.prev=$scope.images;//after reset previous array update
        $scope.sub = "";//empty choice
        $scope.images = [];//empty images array->empty page
        $scope.options=[];//empty options array
        if($scope.dissubmit) $scope.dissubmit=false;
    };

    $scope.nextfunction = () => {//on click next
    	$scope.dissubmit=true;//on next can not click on submit,reset first
    	$scope.images = [];//empty images array
    	for(let image of $scope.next) {
	        $scope.images.push(image);//images array update with next array
	    }
    };


    $scope.previous = () => {//on click previous
    	$scope.dissubmit=true;//on previous can not click on submit,reset first
    	if($scope.images.length===0)$scope.disnxt=true;//if page empty disabled next button
    	else $scope.disnxt=false;

    	if($scope.next){//if there is images in next array->empty array
    		$scope.next = [];
    	}
    	for(let image of $scope.images) {
	        $scope.next.push(image);//update next array with current array
	    }
    	if($scope.prev){//if previous array not empty
    		$scope.sub = "";//empty sub
    		$scope.images = [];//empty page
    	}
	    for(let image of $scope.prev) {
	        $scope.images.push(image);//update images array-> update page
	    }
    };

    $scope.search = () => {
        reddit.top($scope.sub).t('all').limit(25).fetch(function(res) {
            /*console.log(res);*/
            if(!res.error){//if there is no error in the response
	            for(let image of res.data.children) {
	                if((image.data.post_hint === 'image' && image.data.archived)||
	                (image.data.url.includes("jpg")&& image.data.archived)||
	                (image.data.url.includes("png")&& image.data.archived) ){//just if the object is an image
	                    $scope.images.push(image.data);//update images array->update page
	                }
	            }
        	}
            $scope.$apply();

            if($scope.images.length===0){//if images stay empty->error.search related subreddits
            	  reddit.subredditsByTopic($scope.sub).fetch(function(resnew){
            	  	/*console.log(resnew);*/
            	  	$scope.related=true;//show option array
            	  	for(let option of resnew) {
		                $scope.options.push(option.name);//update option array
		            }
		            $scope.$apply();
            	  });
            }
        });

    };
});