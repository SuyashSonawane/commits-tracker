let user = "suyashsonawane";
let repo = "sbpim";
let sha = "125fbb5a41b66bbb24291631516858c9848acd9b";
let csvContent = "id,date,message,url\n";

const getInfo = async () => {
  let df = [];
  let counter = 0;
  let data;
  user = $("#user").val();
  repo = $("#repo").val();
  sha = $("#sha").val();

  if (user.length == 0 || repo.length == 0) {
    alert("empty fields");
    return;
  }
  if (sha.length == 0)
    data = await fetch(`https://api.github.com/repos/${user}/${repo}/commits`);
  else
    data = await fetch(
      `https://api.github.com/repos/${user}/${repo}/commits?per_page=500&sha=${sha}`
    );
  if (data.status == 404) {
    alert(`${data.status} , ${data.statusText}`);
    return;
  }
  console.log(data);
  let json = await data.json();
  //   console.log(json);
  $(".group-1").fadeOut("slow");
  $(".group-2").html(`   
    
            <div class="media m-5">
          <img
            class="align-self-center mr-3"
            src="${json[0].author.avatar_url}"
            alt="User Img"
            height="100px"
            width="100px"
          />
          <div class="media-body">
            <h5 class="mt-0"><a href="${json[0].author.html_url}" target="_blank"> ${json[0].author.login}</a></h5>
            <h5 class="mt-0">Repo: ${repo}</a></h5>
              <button
          type="button"
          class="btn btn-primary btn-lg"
          onclick="download()"
        >
          Download as CSV
        </button>
          </div>
        </div>
    
    `);

  let table = $("<table>").addClass("table table-hover");
  let head = $("<thead>").html(`
    <tr>
        <th scope="col">#</th>
        <th scope="col">Date</th>
        <th scope="col">Message</th>
        <th scope="col">Commit Url</th>
    </tr>

`);
  table.append(head);

  json.forEach((element) => {
    counter++;
    df.push(
      [
        counter,
        element.commit.author.date.split("T")[0],
        element.commit.message,
        element.html_url,
      ].join()
    );

    let row = $("<tr>").html(
      ` <th scope="row">${counter}</th>
          <td>${element.commit.author.date.split("T")[0]}</td>
          <td>${element.commit.message}</td>
          <td><a href="${element.html_url}" target="_blank"> ${
        element.html_url
      }</a></td>`
    );

    table.append(row);
  });
  $(".tableContainer").html(table);
  csvContent += df.join("\n");
};

const download = () => {
  let blob = new Blob([csvContent], { type: "text/csv" });
  let url = window.URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", `${user}_${repo}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
