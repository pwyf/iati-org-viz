$(function(){$("form").on("submit",function(){return!1}),$("#iati-org-popup body").on("click","a.list-group-item",function(){return chrome.runtime.sendMessage({action:"msg.opentab",url:$(this).attr("href")}),!1});var e='https://iatiregistry.org/api/3/action/package_search?fq=extras_filetype:organisation&q=title:"{}" OR license_id:"{}" OR maintainer:"{}" OR maintainer_email:"{}" OR author_email:"{}" OR name:"{}" OR organization:"{}" OR extras_country:"{}" OR extras_publisher_country:"{}" OR extras_publisher_iati_id:"{}"';$("#org-file-name").on("keyup",debounce(function(){var t=$(this).val();""!==t?($(".list-group").html('<div id="mini-spinner"><div></div></div>'),chrome.runtime.sendMessage({action:"msg.jsonrequest",url:e.replace(/\{\}/g,encodeURIComponent(t))},function(e){var t=[];e.message.success&&e.message.result.results.forEach(function(e){t.push('<a data-dataset-name="'+e.name+'" data-download-url="'+e.resources[0].url+'" href="https://iatiregistry.org/dataset/'+e.name+'" class="list-group-item pwyf-org-viz-btn"><span class="badge"><span class="fas fa-link"></span></span> '+e.title+"</a>")});$(".list-group").html(t.join(""))})):$(".list-group").html("")},500))});