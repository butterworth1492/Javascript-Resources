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
  Purpose: This script renders takes all markup in HTTP response bodies, identifies portions
           that are commented out, uncomments the block, and makes it stand out in the rendered
           page.
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


// Simply modify the response body so that all commented HTML code is uncommented
// and stands out in the browser.
function proxyResponse(msg) {
     //print('proxyResponse called for url=' + msg.getRequestHeader().getURI().toString())

    var body = msg.getResponseBody().toString();

    //body = body.replace(/(\<body\>|\<body[^>]+\>)/, "$1\n" + findings);

    body = body.replace(/\<!--/, "<div style=\"border:solid 3px rgb(75,255,51)\"><!--");

    msg.setResponseBody(body);
    msg.getResponseHeader().setContentLength(body.length());

    return true
}
