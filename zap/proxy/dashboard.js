/*
 Copyright (c) 2015, butterworth1492
 All rights reserved.
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/* 
  Author:  Jason Miller
  Purpose: This script renders a "dashboard" at the top of pages rendered in the browser.  It is
           designed to bring awareness to the pen-tester regarding potentially interesting content 
           in the markup.
  Notes:   It's rather bare-bones at the moment.
*/

// This function is for debuging javascript object types.
// Usage: printType( what_the_hell_is_this_object );
function printType(object)
  {
    print(">>>"+Object.prototype.toString.call(object)+"<<<"+((object===null)?"  [NULL]":""));
  } // end printType();

// Do nothing for requests.
function proxyRequest(msg) 
  {   
    return true
  } // end proxyRequest()

// Look for stuff and render a dashboard in the browser.
function proxyResponse(msg) 
  {
    // Grab the original response.
    var body = msg.getResponseBody().toString();
    var content_type = msg.getResponseHeader().getHeader("Content-Type")

    // The regexes.  Far from perfect.
    var html_comments = body.match(/\<!--/gi);
    var hidden_inputs = body.match(/type=\"?hidden\"?/gi);
    var hidden_elements = body.match(/(display|visibility):(hidden|none)/gi);    

    // Initialize the empty variable that will later hold the dashboard content.
    var new_content = "";
    var spacer = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"

    // Scrape all the things.
    if ( html_comments )
      new_content += " HTML comments: <strong>" + html_comments.length + "</strong>" + spacer;
    if ( hidden_inputs )
      new_content += " Hidden form inputs: <strong>" + hidden_inputs.length + "</strong>" + spacer;
    if ( hidden_elements )
      new_content += " Hidden DOM elements: <strong>" + hidden_elements.length + "</strong>" + spacer;

    var dashboard = "<div style=\"font-size:9px; padding:2px; background:rgb(250,227,227); width:100%; border-bottom:solid 1px rgb(145,76,76);\">" + new_content + "</div>";

    body = body.replace(/(\<body\>|\<body[^>]+\>)/, "$1\n"+dashboard);

    // Replace the original body with the one that has our mods.
    msg.setResponseBody(body);
    msg.getResponseHeader().setContentLength(body.length());

    return true
}
