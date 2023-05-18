// FakeAgent github.com/bradsec

window.addEventListener('DOMContentLoaded', function() {
    var osList = [
      { name: 'Windows', osCode: 'Windows NT', versions: ['10.0'], weight: 40 },
      { name: 'Macintosh', osCode: 'Macintosh; Intel Mac OS X', versions: ['13_3_1'], weight: 30 },
      { name: 'iPhone', osCode: 'iPhone; CPU iPhone OS', versions: ['16_4_1', '16_3_1'], models: ['Mobile/15E148'], weight: 15 },
      { name: 'Android', osCode: 'Linux; Android', versions: ['13'], models: ['SM-A205U', 'SM-A102U', 'SM-G960U', 'SM-N960U', 'LM-Q720', 'LM-X420', 'LM-Q710(FGN)'], weight: 15 },
      { name: 'Linux', osCode: 'X11; Linux x86_64', versions: [''], weight: 15 }
    ];
  
    var browserList = [
        { name: 'Chrome', browserCode: 'Chrome', majorVersion: ['113.0.5672', '114.0.1687'], weight: 50 },
        { name: 'Firefox', browserCode: 'Firefox', majorVersion: ['113.0', '112.0'], weight: 20 },
        { name: 'Safari', browserCode: 'Version', majorVersion: ['16.0', '16.1'], weight: 15 },
        { name: 'Edge', browserCode: 'Edg', majorVersion: ['113.0.1774', '114.0.1687'], weight: 10 },
      ];
  
    function getRandomWeightedIndex(list) {
      var totalWeight = list.reduce(function(sum, item) {
        return sum + item.weight;
      }, 0);
  
      var randomNum = Math.random() * totalWeight;
      var cumulativeWeight = 0;
  
      for (var i = 0; i < list.length; i++) {
        cumulativeWeight += list[i].weight;
        if (randomNum < cumulativeWeight) {
          return i;
        }
      }
  
      return 0;
    }
  
    function getRandomVersion(versions) {
        var randomIndex = Math.floor(Math.random() * versions.length);
        return versions[randomIndex];
      }

      function getRandomMinorVersion() {
        // Generates a random 3 digit number
        return Math.floor(Math.random() * 999) + 100;
      }
  
      function generateUserAgent(os, browser) {
        var randomOSVersion = getRandomVersion(os.versions);
        var randomBrowserMajorVersion = getRandomVersion(browser.majorVersion);
        var randomBrowserMinorVersion = getRandomMinorVersion();
        var userAgent = 'Mozilla/5.0 (' + os.osCode + ' ' + randomOSVersion;
      
        if (os.models) {
          userAgent += '; ' + getRandomVersion(os.models);
        }
      
        userAgent += ') AppleWebKit/537.36 (KHTML, like Gecko) ';
      
        // Restricting Safari to only macOS and iPhone
        if ((browser.name == "Safari" && (os.name == "Macintosh" || os.name == "iPhone")) || (browser.name != "Safari")) {
          userAgent += browser.browserCode + '/' + randomBrowserMajorVersion + '.' + randomBrowserMinorVersion;
        } else {
          return null;
        }
      
        if (os.name == "Android" || os.name == "iPhone") {
          userAgent += ' Mobile Safari/537.36';
        }
      
        return userAgent;
      }
  
    function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  function generateUserAgentList(numUserAgents) {
    var userAgentList = [];
    var userAgentJSON = [];
    var userAgentCSV = '';
  
    while (userAgentList.length < numUserAgents) {
    var randomOSIndex = getRandomWeightedIndex(osList);
    var randomBrowserIndex = getRandomWeightedIndex(browserList);
  
    var randomOS = osList[randomOSIndex];
    var randomBrowser = browserList[randomBrowserIndex];
    var userAgent = generateUserAgent(randomOS, randomBrowser);
  
    if (userAgent !== null && userAgent !== '') {
      userAgentList.push(userAgent);
      userAgentJSON.push({ user_agent: userAgent });
      userAgentCSV += '\"' + userAgent + '\" ,';
    }
  }
  
    shuffleArray(userAgentList);
    shuffleArray(userAgentJSON);
    userAgentCSV = userAgentCSV.slice(0, -1);
  
    return {
      userAgentList: userAgentList,
      userAgentJSON: JSON.stringify(userAgentJSON, null, 2),
      userAgentCSV: userAgentCSV
    };
  }
  
  function updatePage(numUserAgents, format) {
    var userAgentData = generateUserAgentList(numUserAgents);
    var outputArea = document.getElementById('userAgentOutput');
  
    switch (format) {
      case 'list':
        outputArea.value = userAgentData.userAgentList.join('\n');
        break;
      case 'json':
        outputArea.value = userAgentData.userAgentJSON;
        break;
      case 'csv':
        outputArea.value = userAgentData.userAgentCSV;
        break;
    }
  }
  
  function updatePageAsync(numUserAgents, format) {
    setTimeout(function () {
      updatePage(numUserAgents, format);
    }, 0);
  }
  
  // Initial generation with default value
  updatePageAsync(10, 'list');
  
  // Handler for select element change
  var selectElement = document.getElementById('numUserAgents');
  selectElement.addEventListener('change', function(event) {
    var numUserAgents = parseInt(event.target.value);
    updatePageAsync(numUserAgents, 'list');
  });
  
  document.getElementById('formatList').addEventListener('click', function() {
    var numUserAgents = parseInt(document.getElementById('numUserAgents').value);
    updatePageAsync(numUserAgents, 'list');
  });
  
  document.getElementById('formatJSON').addEventListener('click', function() {
    var numUserAgents = parseInt(document.getElementById('numUserAgents').value);
    updatePageAsync(numUserAgents, 'json');
  });
  
  document.getElementById('formatCSV').addEventListener('click', function() {
    var numUserAgents = parseInt(document.getElementById('numUserAgents').value);
    updatePageAsync(numUserAgents, 'csv');
  });
  
  // Clipboard copy action
  document.getElementById('copyButton').addEventListener('click', function() {
    var button = this;
    navigator.clipboard.writeText(document.getElementById('userAgentOutput').value).then(function() {
      button.textContent = 'Copied!';
      setTimeout(function() {
        button.textContent = 'Copy to Clipboard';
      }, 2000);
    });
  });
  });