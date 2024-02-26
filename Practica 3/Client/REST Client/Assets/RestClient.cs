using System.Collections;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.Networking;

public class RestClient : MonoBehaviour
{
    [Header("Some filters")]
    public string playerID;
    public string nameContains;
    public int minScore;
    public int maxScore;
    public int scoreToIncrease;

    [Header("POST settings")]
    public string name;
    public int score;
    public string clas;

    private void Start()
    {
    }

    public void GetAllPlayers()
    {
        StartCoroutine(GetAllPlayersCorr());
    }

    public void GetPlayerById()
    {
        StartCoroutine(GetPlayerByIdCorr());
    }

    public void GetPlayerByFilter()
    {
        StartCoroutine(GetPlayersByFilterCorr());
    }

    public void PostPlayer()
    {
        StartCoroutine(PostPlayerCorr());
    }

    public void UpdatePlayer()
    {
        StartCoroutine(UpdatePlayerCorr());
    }

    public void DeletePlayer()
    {
        StartCoroutine(DeletePlayerCorr());
    }

    public void UpdatePlayersConditional()
    {
        StartCoroutine(UpdatePlayersConditionalCorr());
    }

    public IEnumerator GetAllPlayersCorr()
    {
        string url = "http://127.0.0.1:8080/players";
        UnityWebRequest request = UnityWebRequest.Get(url);
        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
            Debug.Log("Error al realizar la solicitud: " + request.error);
        else
            Debug.Log("Respuesta recibida: " + request.downloadHandler.text);
    }
    public IEnumerator GetPlayerByIdCorr()
    {
        string url = "http://127.0.0.1:8080/players/" + playerID;
        UnityWebRequest request = UnityWebRequest.Get(url);
        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
            Debug.Log("Error al realizar la solicitud: " + request.error);
        else
            Debug.Log("Respuesta recibida: " + request.downloadHandler.text);
    }

    public IEnumerator GetPlayersByFilterCorr()
    {
        string url = "http://127.0.0.1:8080/players/filter/" + nameContains + "/" + minScore;
        UnityWebRequest request = UnityWebRequest.Get(url);
        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
            Debug.Log("Error al realizar la solicitud: " + request.error);
        else
            Debug.Log("Respuesta recibida: " + request.downloadHandler.text);
    }

    private IEnumerator PostPlayerCorr()
    {
        string url = "http://127.0.0.1:8080/players/post";

        string jsonData = "{\"name\":\"" + name + "\",\"score\":" + score + ",\"class\":\"" + clas + "\"}";

        byte[] byteData = Encoding.UTF8.GetBytes(jsonData);

        UnityWebRequest request = new UnityWebRequest(url, "POST");
        request.uploadHandler = new UploadHandlerRaw(byteData);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
            Debug.Log("Error al realizar la solicitud: " + request.error);
        else
            Debug.Log("Respuesta recibida: " + request.downloadHandler.text);
    }

    private IEnumerator UpdatePlayerCorr()
    {
        string url = "http://127.0.0.1:8080/players/update/" + playerID;

        string jsonData = "{\"name\":\"" + name + "\",\"score\":" + score + ",\"class\":\"" + clas + "\"}";

        byte[] byteData = Encoding.UTF8.GetBytes(jsonData);

        UnityWebRequest request = new UnityWebRequest(url, "PUT");
        request.uploadHandler = new UploadHandlerRaw(byteData);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
            Debug.Log("Error al realizar la solicitud: " + request.error);
        else
            Debug.Log("Respuesta recibida: " + request.downloadHandler.text);
    }

    private IEnumerator UpdatePlayersConditionalCorr()
    {
        string url = "http://127.0.0.1:8080/players/update/" + scoreToIncrease + "/" + maxScore;

        UnityWebRequest request = UnityWebRequest.Put(url, "");
        request.method = "PUT";
        request.SetRequestHeader("Content-Type", "application/json");
        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
            Debug.Log("Error al realizar la solicitud: " + request.error);
        else
            Debug.Log("Respuesta recibida: " + request.downloadHandler.text);
    }

    public IEnumerator DeletePlayerCorr()
    {
        string url = "http://127.0.0.1:8080/players/delete/" + playerID;
        UnityWebRequest request = UnityWebRequest.Delete(url);
        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
        {
            Debug.Log("Error al realizar la solicitud: " + request.error);
        }
        else
        {
            if (request.downloadHandler != null)
                Debug.Log("Respuesta recibida: " + request.downloadHandler.text);
            else
                Debug.Log("Respuesta recibida: codigo " + request.responseCode);
        }
    }
}

