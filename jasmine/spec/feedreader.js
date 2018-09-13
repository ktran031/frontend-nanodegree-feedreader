/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */

$(function() {
 
	 /* This is our first test suite - a test suite just contains
	 * a related set of tests. This suite is all about the RSS
	 * feeds definitions, the allFeeds variable in our application.
	 */
	describe('RSS Feeds', function() {
		/* This is our first test suite - a test suite just contains
		* a related set of tests. This suite is all about the RSS
		* feeds definitions, the allFeeds variable in our application.
		*/
		it('are defined', function() {
			expect(allFeeds).toBeDefined();
			expect(allFeeds.length).not.toBe(0);
		});


		/* A test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
		it('ensure all feed has a URL defined and the URL is not empty', function() {
			allFeeds.forEach(function(feed) {
				expect(feed.url).toBeDefined();
				expect(typeof feed.url).toMatch('string');
				expect(feed.url.trim().length).not.toBe(0);
			});
		});


		/* A test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
		it('ensures feed to have a name defined and the name is not empty', function() {
			allFeeds.forEach(function(feed) {
				expect(feed.name).toBeDefined();
				expect(typeof feed.name).toMatch('string');
				expect(feed.name.trim().length).not.toBe(0);
			});
		});
	});

	/* The Menu Test Section */

	describe('The menu', function() {
		let menuElement = $('.slide-menu');
		let menuIconElement = $('.menu-icon-link');


		/* Check there is only one menu.
		 */
		it('has only one menu', function() {
			expect(menuElement.length).toEqual(1);
		});


		/* Test that ensures the menu element is hidden by default.
		 */
		it('menu element is hidden by default', function() {
			expect($('body').hasClass('menu-hidden')).toBe(true);
		});


		/* Test that ensures the menu changes visibility when the
		 *  menu icon is clicked. This test has two expectations:
		 *  the menu displays when clicked and hides when clicked again.
		 */
		it(' menu displays when clicked and hides when clicked again', function() {

			//Prepare for Test
			expect($('body').hasClass('menu-hidden')).toBe(true);

			// Trigger the click on the menu Button
			menuIconElement.click();

			// Check that the menu-hidden class has been removed from body
			expect($('body').hasClass('menu-hidden')).toBe(false);

			// Trigger the click on the menu Button
			menuIconElement.click();

			// Check that the menu-hidden class has been added to body
			expect($('body').hasClass('menu-hidden')).toBe(true);
		});


		/* Check the menu is actually visible to the user.
		 */
		describe('visibility', function() {

			/* Test the menu is not shown in the document when hidden.
			 */
			it('positions menu content completely to left of document when hidden', function() {

				//Prepare for Test
				expect($('body').hasClass('menu-hidden')).toBe(true);
				let elementOffset = menuElement.offset();

				//Check the Menu has been moved sufficiently to the left to make it hidden
				expect(elementOffset.left + menuElement.outerWidth()).not.toBeGreaterThan(0);
			});

			/* Test the menu is shown on left margin folowing transition.
			 */
			describe('after transition', function() {

				//Prepare for Test
				beforeEach(function(done) {
					menuElement[0].addEventListener("transitionend", done, false);
					menuIconElement.click();
				});

				/* Test position of menu when visible.
				 */
				it('positions menu content at document left when visible', function(done) {
					expect($('body').hasClass('menu-hidden')).toBe(false);

					// Check Menu is in correct position
					let elementOffset = menuElement.offset();
					expect(elementOffset.left).toEqual(0);

					// Tidy Up after test
					menuElement[0].removeEventListener("transitionend", done, false);
					menuIconElement.click();

					// Complete Async Test
					done();
				});
			});
		});


		/* Test to ensure when a link in our feedList menu is clicked on,
		 * the menu is hidden indicating successful trigger of feed selection
		 */
		describe('Menu hidden after item selection', function() {

			// Get all the link items out of the menu and count
			let menuFeedItems = $('.feed-list').find('a');
			let testID = 1;

			beforeEach(function() {
				// Click on the Menu Icon to display the menu.
				let menuIconElement = $('.menu-icon-link');
				menuIconElement.click();

				// Click on one of the feeds in menu
				menuFeedItems[testID].click();
			});

			afterEach(function() {
				// Tidy up and return to default feed
				menuFeedItems[0].click();
			});


			/* Test the menu element is now hidden.
			 */
			it('menu hidden by default', function() {
				expect($('body').hasClass('menu-hidden')).toBe(true);
			});
		});
	});


	/* Initial Entries Tests Section */

	describe('Initial Entries', function() {

		let container = $('.feed');

		beforeEach(function(done) {
			loadFeed(0, done);
		});


		/* Test loadFeed function can be called and complete its work
		 * there is at least a single .entry element within the .feed
		 * container.
		 */
		it('displays at least one item in feed', function() {
			let items = container.find('.entry');
			expect(items.length).toBeGreaterThan(0);
		});


		/* Test loadFeed updates the header title to display the feed name.
		 */
		it('displays the feed heading', function() {
			let feedName = allFeeds[0].name;
			let headerTitle = $('.header-title');
			expect(headerTitle.html().trim()).toMatch(feedName.trim());
		});
	});

	/* New Feed Selection Tests Section */

	/* test that ensures when a new feed is loaded
	 * by the loadFeed function that the content actually changes.
	 */
	describe('New Feed Selection', function() {

		/* feed_id_test - the array index id (starts at 0) of the allFeeds to use
		 * from the menu feed list for the test new feed selection.
		 */
		let feed_id_test = 1;


		/* Test there is more than one feed in the menu feed-list, indicating it is
		 * possible a different feed can be selected by the user.
		 */
		it('has more than one feed to select', function() {
			let feeds = $('.feed-list').children();

			//check there is at least two feeds to select from
			expect(feeds.length).toBeGreaterThan(1);

			// Check our feed_id_test is a valid feed to test
			expect(feeds.length).toBeGreaterThan(feed_id_test);
		});


		/* Test loadFeed updates displayed feed entries and heading
		 */
		describe('Update of Feed', function() {

			let TEST_TEXT = '-- Udacity Feed Reader Test --';

			/* Before test, set up a known value in feed entry headings to check
			 * it is overwritten. This addresses the possibilty two different feeds
			 * could have the same feed entries and therefore cannot
			 * reliably be used to detect change. e.g. A feed for a blog
			 * single-category and a seperate feed for blog all-posts could have
			 * the same content if no other category posts have been made.
			 */
			beforeEach(function(done) {
				// select array of all feed headings
				let feedEntryHeadings = $('.entry').find('h2');

				// Update all headings with testing text for detection purposes
				feedEntryHeadings.html(TEST_TEXT);

				//Load the second feed with async done callback
				loadFeed(feed_id_test, done);
			});

			afterEach(function(done) {
				//After test, return back to default
				loadFeed(0, done);
			});


			/* test that ensures when a new feed is loaded
			 * by the loadFeed function that the content actually changes.
			 */
			it('changes entries in feed', function() {

				let items = $('.entry');

				/* check there are feed entries */
				expect(items.length).toBeGreaterThan(0);

				/* Check for inserted TEST_TEXT to see if it exists in headings.
				 */
				let feedEntryHeadingsMatched = $(".entry h2:contains('" + TEST_TEXT + "')");
				expect(feedEntryHeadingsMatched.length).toEqual(0);
			});


			/* test that ensures when a new feed is loaded
			 * by the loadFeed function that the header title is updated
			 * to display the feed name.
			 */
			it('updates the heading to feed name', function() {
				let feedName = allFeeds[feed_id_test].name;
				let headerTitle = $('.header-title');
				expect(headerTitle.html().trim()).toMatch(feedName.trim());
			});
		});
	});

}());
