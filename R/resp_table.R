con <- DBI::dbConnect(
              RMariaDB::MariaDB(),
              host = '127.0.0.1',
              port = '3306',
              user = 'root',
              password = 'example',
              dbname = 'jsPsych'
            )

query <- 
  "CREATE OR REPLACE TABLE surveyResp (
    question VARCHAR(50),
    response VARCHAR(50)
    )"
DBI::dbSendQuery(con, query)
DBI::dbDisconnect(con)
